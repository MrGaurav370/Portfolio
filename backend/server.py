from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import (
    Profile, ProfileUpdate, 
    Skill, SkillCreate, 
    Project, ProjectCreate, ProjectUpdate,
    ContactMessage, ContactCreate
)
from typing import List, Optional
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# ==================== PROFILE ENDPOINTS ====================
@api_router.get("/profile", response_model=Profile)
async def get_profile():
    """Get profile information"""
    profile = await db.profile.find_one({})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.pop("_id", None)
    return Profile(**profile)

@api_router.put("/profile", response_model=Profile)
async def update_profile(profile_update: ProfileUpdate):
    """Update profile information"""
    update_data = profile_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.profile.update_one({}, {"$set": update_data}, upsert=True)
    updated_profile = await db.profile.find_one({})
    updated_profile.pop("_id", None)
    return Profile(**updated_profile)

# ==================== SKILLS ENDPOINTS ====================
@api_router.get("/skills", response_model=List[Skill])
async def get_skills():
    """Get all skill categories"""
    skills = await db.skills.find().sort("id", 1).to_list(100)
    for skill in skills:
        skill.pop("_id", None)
    return [Skill(**skill) for skill in skills]

@api_router.post("/skills", response_model=Skill)
async def create_skill(skill: SkillCreate):
    """Create new skill category"""
    existing_skills = await db.skills.find().sort("id", -1).limit(1).to_list(1)
    next_id = existing_skills[0]["id"] + 1 if existing_skills else 1
    
    skill_dict = skill.dict()
    skill_dict["id"] = next_id
    skill_dict["created_at"] = datetime.utcnow()
    
    await db.skills.insert_one(skill_dict)
    skill_dict.pop("_id", None)
    return Skill(**skill_dict)

# ==================== PROJECTS ENDPOINTS ====================
@api_router.get("/projects", response_model=List[Project])
async def get_projects(featured: Optional[bool] = None):
    """Get all projects, optionally filter by featured"""
    query = {"featured": featured} if featured is not None else {}
    projects = await db.projects.find(query).sort("id", 1).to_list(100)
    for project in projects:
        project.pop("_id", None)
    return [Project(**project) for project in projects]

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: int):
    """Get single project by ID"""
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.pop("_id", None)
    return Project(**project)

@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    """Create new project"""
    existing_projects = await db.projects.find().sort("id", -1).limit(1).to_list(1)
    next_id = existing_projects[0]["id"] + 1 if existing_projects else 1
    
    project_dict = project.dict()
    project_dict["id"] = next_id
    project_dict["created_at"] = datetime.utcnow()
    project_dict["updated_at"] = datetime.utcnow()
    
    await db.projects.insert_one(project_dict)
    project_dict.pop("_id", None)
    return Project(**project_dict)

@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: int, project_update: ProjectUpdate):
    """Update project"""
    update_data = project_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.projects.update_one({"id": project_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    updated_project = await db.projects.find_one({"id": project_id})
    updated_project.pop("_id", None)
    return Project(**updated_project)

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: int):
    """Delete project"""
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True, "message": "Project deleted successfully"}

# ==================== CONTACT ENDPOINTS ====================
@api_router.post("/contact", response_model=dict)
async def submit_contact(contact: ContactCreate):
    """Submit contact form"""
    contact_dict = ContactMessage(**contact.dict()).dict()
    await db.contacts.insert_one(contact_dict)
    return {"success": True, "message": "Message sent successfully"}

@api_router.get("/contact/messages", response_model=List[ContactMessage])
async def get_contact_messages():
    """Get all contact messages (admin endpoint)"""
    messages = await db.contacts.find().sort("created_at", -1).to_list(100)
    for message in messages:
        message.pop("_id", None)
    return [ContactMessage(**message) for message in messages]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
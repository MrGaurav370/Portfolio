"""FastAPI backend for the portfolio."""
import logging
import os
import secrets
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware

from models import (
    ContactCreate, ContactMessage, Profile, ProfileUpdate, Project,
    ProjectCreate, ProjectUpdate, Skill, SkillCreate, utcnow,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("portfolio")

CONTACT_LIMIT = int(os.environ.get("CONTACT_RATE_LIMIT", "5"))  # messages per window
CONTACT_WINDOW = 3600  # seconds
_contact_hits: dict = defaultdict(deque)


def create_app(db=None) -> FastAPI:
    """App factory. Pass a database to override the Mongo connection (used in tests)."""
    client = None
    if db is None:
        client = AsyncIOMotorClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
        db = client[os.environ.get("DB_NAME", "portfolio_db")]

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        await db.projects.create_index("id", unique=True)
        await db.skills.create_index("id", unique=True)
        if os.environ.get("AUTO_SEED", "true").lower() == "true" and await db.profile.count_documents({}) == 0:
            from seed_data import profile_data, projects_data, skills_data
            await db.profile.insert_one({**profile_data, "updated_at": utcnow()})
            await db.skills.insert_many([{**s, "created_at": utcnow()} for s in skills_data])
            await db.projects.insert_many([{**p, "created_at": utcnow(), "updated_at": utcnow()} for p in projects_data])
            logger.info("Database was empty - seeded default portfolio data")
        yield
        if client:
            client.close()

    app = FastAPI(title="Portfolio API", version="2.0.0", lifespan=lifespan)

    # ---- auth: write endpoints need X-Admin-Key matching ADMIN_API_KEY
    async def require_admin(x_admin_key: Optional[str] = Header(default=None)):
        expected = os.environ.get("ADMIN_API_KEY")
        if not expected:
            raise HTTPException(503, "Admin endpoints are disabled (ADMIN_API_KEY is not set)")
        if not x_admin_key or not secrets.compare_digest(x_admin_key, expected):
            raise HTTPException(401, "Invalid or missing admin key")

    admin = [Depends(require_admin)]
    api = APIRouter(prefix="/api")

    async def next_id(collection) -> int:
        last = await collection.find().sort("id", -1).limit(1).to_list(1)
        return last[0]["id"] + 1 if last else 1

    @api.get("/")
    async def root():
        return {"message": "Portfolio API", "docs": "/docs"}

    @api.get("/health")
    async def health():
        try:
            await db.profile.count_documents({})
            return {"status": "ok", "database": "up"}
        except Exception:  # noqa: BLE001
            raise HTTPException(503, "database unavailable")

    # ---- profile
    @api.get("/profile", response_model=Profile)
    async def get_profile():
        doc = await db.profile.find_one({}, {"_id": 0})
        if not doc:
            raise HTTPException(404, "Profile not found")
        return Profile(**doc)

    @api.put("/profile", response_model=Profile, dependencies=admin)
    async def update_profile(update: ProfileUpdate):
        data = update.model_dump(exclude_unset=True)
        data["updated_at"] = utcnow()
        await db.profile.update_one({}, {"$set": data}, upsert=True)
        return Profile(**await db.profile.find_one({}, {"_id": 0}))

    # ---- skills
    @api.get("/skills", response_model=List[Skill])
    async def get_skills():
        return [Skill(**s) for s in await db.skills.find({}, {"_id": 0}).sort("id", 1).to_list(100)]

    @api.post("/skills", response_model=Skill, dependencies=admin)
    async def create_skill(skill: SkillCreate):
        doc = {**skill.model_dump(), "id": await next_id(db.skills), "created_at": utcnow()}
        await db.skills.insert_one(dict(doc))
        return Skill(**doc)

    # ---- projects
    @api.get("/projects", response_model=List[Project])
    async def get_projects(featured: Optional[bool] = None):
        query = {} if featured is None else {"featured": featured}
        return [Project(**p) for p in await db.projects.find(query, {"_id": 0}).sort("id", 1).to_list(200)]

    @api.get("/projects/{project_id}", response_model=Project)
    async def get_project(project_id: int):
        doc = await db.projects.find_one({"id": project_id}, {"_id": 0})
        if not doc:
            raise HTTPException(404, "Project not found")
        return Project(**doc)

    @api.post("/projects", response_model=Project, dependencies=admin)
    async def create_project(project: ProjectCreate):
        now = utcnow()
        doc = {**project.model_dump(), "id": await next_id(db.projects), "created_at": now, "updated_at": now}
        await db.projects.insert_one(dict(doc))
        return Project(**doc)

    @api.put("/projects/{project_id}", response_model=Project, dependencies=admin)
    async def update_project(project_id: int, update: ProjectUpdate):
        data = update.model_dump(exclude_unset=True)
        data["updated_at"] = utcnow()
        result = await db.projects.update_one({"id": project_id}, {"$set": data})
        if result.matched_count == 0:
            raise HTTPException(404, "Project not found")
        return Project(**await db.projects.find_one({"id": project_id}, {"_id": 0}))

    @api.delete("/projects/{project_id}", dependencies=admin)
    async def delete_project(project_id: int):
        result = await db.projects.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(404, "Project not found")
        return {"success": True, "message": "Project deleted successfully"}

    # ---- contact
    @api.post("/contact", response_model=dict)
    async def submit_contact(contact: ContactCreate, request: Request):
        ip = request.client.host if request.client else "unknown"
        hits, now = _contact_hits[ip], time.monotonic()
        while hits and now - hits[0] > CONTACT_WINDOW:
            hits.popleft()
        if len(hits) >= CONTACT_LIMIT:
            raise HTTPException(429, "Too many messages. Please try again later.")
        hits.append(now)
        await db.contacts.insert_one(ContactMessage(**contact.model_dump()).model_dump())
        return {"success": True, "message": "Message sent successfully"}

    @api.get("/contact/messages", response_model=List[ContactMessage], dependencies=admin)
    async def get_contact_messages():
        docs = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
        return [ContactMessage(**d) for d in docs]

    app.include_router(api)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",") if o.strip()],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


app = create_app()

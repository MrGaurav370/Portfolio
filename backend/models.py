from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# Profile Models
class Profile(BaseModel):
    name: str
    title: str
    tagline: str
    bio: str
    email: EmailStr
    github: str
    linkedin: str
    twitter: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[EmailStr] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None

# Skill Models
class Skill(BaseModel):
    id: int
    category: str
    items: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SkillCreate(BaseModel):
    category: str
    items: List[str]

# Project Models
class Project(BaseModel):
    id: int
    title: str
    description: str
    technologies: List[str]
    image: str
    demoUrl: str
    githubUrl: str
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    description: str
    technologies: List[str]
    image: str
    demoUrl: str
    githubUrl: str
    featured: bool = False

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    image: Optional[str] = None
    demoUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    featured: Optional[bool] = None

# Contact Models
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

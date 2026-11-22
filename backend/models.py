"""Pydantic models for the portfolio API."""
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------- Profile
class Profile(BaseModel):
    name: str
    title: str
    tagline: str
    bio: str
    email: EmailStr
    github: str = ""
    linkedin: str = ""
    twitter: str = ""
    phone: str = ""
    location: str = ""
    updated_at: datetime = Field(default_factory=utcnow)


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[EmailStr] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None


# ----------------------------------------------------------------- Skills
class Skill(BaseModel):
    id: int
    category: str
    items: List[str]
    created_at: datetime = Field(default_factory=utcnow)


class SkillCreate(BaseModel):
    category: str = Field(min_length=1, max_length=80)
    items: List[str]


# --------------------------------------------------------------- Projects
class Project(BaseModel):
    id: int
    title: str
    description: str
    technologies: List[str]
    image: str = ""
    demoUrl: str = ""
    githubUrl: str = ""
    route: str = ""  # in-app demo route, e.g. "/dashboard"
    featured: bool = False
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=1000)
    technologies: List[str]
    image: str = ""
    demoUrl: str = ""
    githubUrl: str = ""
    route: str = ""
    featured: bool = False


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    image: Optional[str] = None
    demoUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    route: Optional[str] = None
    featured: Optional[bool] = None


# ---------------------------------------------------------------- Contact
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: datetime = Field(default_factory=utcnow)
    read: bool = False


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=150)
    message: str = Field(min_length=5, max_length=5000)

"""Reset the database to the default portfolio data: python seed_database.py"""
import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from models import utcnow
from seed_data import profile_data, projects_data, skills_data

load_dotenv(Path(__file__).parent / ".env")


async def seed_database() -> None:
    client = AsyncIOMotorClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
    db = client[os.environ.get("DB_NAME", "portfolio_db")]
    now = utcnow()
    await db.profile.delete_many({})
    await db.profile.insert_one({**profile_data, "updated_at": now})
    await db.skills.delete_many({})
    await db.skills.insert_many([{**s, "created_at": now} for s in skills_data])
    await db.projects.delete_many({})
    await db.projects.insert_many([{**p, "created_at": now, "updated_at": now} for p in projects_data])
    print(f"Seeded profile, {len(skills_data)} skill groups and {len(projects_data)} projects "
          f"into '{os.environ.get('DB_NAME', 'portfolio_db')}'")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())

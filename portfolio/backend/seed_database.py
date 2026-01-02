"""
Seed the database with initial portfolio data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from seed_data import profile_data, skills_data, projects_data

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'portfolio_db')]
    
    print("🌱 Starting database seeding...")
    
    # Seed Profile
    print("Seeding profile...")
    await db.profile.delete_many({})  # Clear existing
    await db.profile.insert_one(profile_data)
    print("✓ Profile seeded")
    
    # Seed Skills
    print("Seeding skills...")
    await db.skills.delete_many({})  # Clear existing
    await db.skills.insert_many(skills_data)
    print(f"✓ {len(skills_data)} skill categories seeded")
    
    # Seed Projects
    print("Seeding projects...")
    await db.projects.delete_many({})  # Clear existing
    await db.projects.insert_many(projects_data)
    print(f"✓ {len(projects_data)} projects seeded")
    
    print("\n✅ Database seeding complete!")
    print(f"Database: {os.environ.get('DB_NAME', 'portfolio_db')}")
    print(f"Profile: {profile_data['name']}")
    print(f"Skills: {len(skills_data)} categories")
    print(f"Projects: {len(projects_data)} projects")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())

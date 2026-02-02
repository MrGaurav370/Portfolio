# API Contracts - Gaurav Gaur Portfolio

## Overview
This document outlines the API contracts between frontend and backend for the portfolio application.

## Current Mock Data Location
- **File**: `/app/frontend/src/mock.js`
- **Data**: profileData, skills, projects

## Backend API Endpoints

### 1. Profile Endpoint
**GET** `/api/profile`
- **Purpose**: Get profile information
- **Response**:
```json
{
  "name": "string",
  "title": "string",
  "tagline": "string",
  "bio": "string",
  "email": "string",
  "github": "string",
  "linkedin": "string",
  "twitter": "string"
}
```

**PUT** `/api/profile`
- **Purpose**: Update profile information
- **Request Body**: Same as GET response
- **Response**: Updated profile object

---

### 2. Skills Endpoint
**GET** `/api/skills`
- **Purpose**: Get all skill categories
- **Response**:
```json
[
  {
    "id": "number",
    "category": "string",
    "items": ["string"]
  }
]
```

**POST** `/api/skills`
- **Purpose**: Add new skill category
- **Request Body**:
```json
{
  "category": "string",
  "items": ["string"]
}
```

---

### 3. Projects Endpoint
**GET** `/api/projects`
- **Purpose**: Get all projects
- **Query Params**: `?featured=true` (optional)
- **Response**:
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "technologies": ["string"],
    "image": "string",
    "demoUrl": "string",
    "githubUrl": "string",
    "featured": "boolean"
  }
]
```

**GET** `/api/projects/:id`
- **Purpose**: Get single project by ID
- **Response**: Single project object

**POST** `/api/projects`
- **Purpose**: Add new project
- **Request Body**: Project object (without id)

**PUT** `/api/projects/:id`
- **Purpose**: Update project
- **Request Body**: Project object

**DELETE** `/api/projects/:id`
- **Purpose**: Delete project
- **Response**: Success message

---

### 4. Contact Endpoint
**POST** `/api/contact`
- **Purpose**: Submit contact form
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**GET** `/api/contact/messages`
- **Purpose**: Get all contact messages (admin)
- **Response**: Array of contact messages

---

## Database Models

### Profile Model
```python
{
  "_id": ObjectId,
  "name": str,
  "title": str,
  "tagline": str,
  "bio": str,
  "email": str,
  "github": str,
  "linkedin": str,
  "twitter": str,
  "updated_at": datetime
}
```

### Skill Model
```python
{
  "_id": ObjectId,
  "id": int,
  "category": str,
  "items": [str],
  "created_at": datetime
}
```

### Project Model
```python
{
  "_id": ObjectId,
  "id": int,
  "title": str,
  "description": str,
  "technologies": [str],
  "image": str,
  "demoUrl": str,
  "githubUrl": str,
  "featured": bool,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Contact Model
```python
{
  "_id": ObjectId,
  "name": str,
  "email": str,
  "subject": str,
  "message": str,
  "created_at": datetime,
  "read": bool
}
```

---

## Frontend Integration Changes

### Files to Update:
1. **Hero.jsx**: No changes needed (uses profileData from context/hook)
2. **About.jsx**: No changes needed (uses profileData)
3. **Skills.jsx**: Replace mock import with API call
4. **Projects.jsx**: Replace mock import with API call
5. **Contact.jsx**: Replace mock submission with API call

### Create New Files:
- `/app/frontend/src/services/api.js` - API service layer
- `/app/frontend/src/context/PortfolioContext.jsx` - Global state management (optional)

---

## Integration Steps

1. **Backend Development**:
   - Create MongoDB models
   - Implement CRUD endpoints
   - Seed database with mock data
   - Test endpoints with curl

2. **Frontend Integration**:
   - Create API service layer
   - Replace mock imports with API calls
   - Add loading states
   - Add error handling
   - Test complete flow

3. **Deployment Preparation**:
   - Environment variables properly set
   - CORS configured
   - Database connection verified
   - All endpoints tested

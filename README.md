# Portfolio — React + FastAPI 🚀

A full‑stack developer portfolio (React + Tailwind frontend + FastAPI + MongoDB backend) with example projects, reusable UI components, and a small REST API for profile/skills/projects/contact. Designed to be easy to run locally, customise, and deploy.

[![status](https://img.shields.io/badge/status-active-brightgreen)]() [![python](https://img.shields.io/badge/python-3.11+-blue)]() [![license](https://img.shields.io/badge/license-MIT-lightgrey)]()

---

## Table of contents
- [Why this project](#why-this-project)
- [Features](#features-✨)
- [Tech stack](#tech-stack-🔧)
- [Quickstart (Windows)](#quickstart-windows-✅)
- [Environment variables](#environment-variables)
- [API (summary)](#api-summary-📡)
- [Scripts & tests](#scripts--tests)
- [Project structure](#project-structure)
- [Development notes & tips](#development-notes--tips)
- [Contributing](#contributing)
- [License & maintainer](#license--maintainer)

---

## Why this project
- Ready-made portfolio scaffold that demonstrates a modern frontend + backend workflow.
- Ideal for showcasing projects, experimenting with UI components, or using as a starter template for client work.

## Features ✨
- Componentized React UI (`frontend/src/components/`) built with Tailwind + Radix primitives
- FastAPI backend with async MongoDB access (Motor) and Pydantic models
- Seed scripts to populate example profile/skills/projects data (`backend/seed_database.py`)
- Ready-to-run dev experience and production build instructions

## Tech stack 🔧
- Frontend: React 19, TailwindCSS, Radix UI, Create React App (CRACO)
- Backend: FastAPI, Motor (async MongoDB driver), Pydantic
- DB: MongoDB (local or hosted)
- Tests / tooling: pytest, black, isort, flake8, mypy

---

## Quickstart (Windows) ✅
Prereqs: Node.js (>=18), Yarn or npm, Python 3.11+, MongoDB (or a hosted URI).

1) Clone

```powershell
git clone <repo-url>
cd portfolio
```

2) Backend (recommended in PowerShell)

```powershell
# create + activate venv
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# install backend deps
pip install -r backend/requirements.txt

# create .env in backend/ (example below)
# seed the DB
python backend/seed_database.py

# run the backend
uvicorn backend.server:app --reload --host 0.0.0.0 --port 8000
```

3) Frontend

```powershell
cd frontend
# if you use yarn (recommended here)
yarn install
yarn start
# or with npm:
# npm install
# npm start
```

Visit the frontend at http://localhost:3000 and the API at http://localhost:8000/api

---

## Environment variables
Create `backend/.env` with at least — or copy the ready-to-use template `backend/.env.example` and update values for your environment.

PowerShell (recommended on Windows):

```powershell
Copy-Item backend\.env.example backend\.env
```

Unix/macOS:

```bash
cp backend/.env.example backend/.env
```

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
CORS_ORIGINS=http://localhost:3000
# (optional) other vars your production host requires
```

---

## API — quick summary 📡
Base: `/api`

- `GET /api/profile` — get profile info
- `PUT /api/profile` — update profile (Pydantic `ProfileUpdate`)
- `GET /api/skills` — list skill categories
- `POST /api/skills` — create skill category
- `GET /api/projects` — list projects (query `?featured=true` to filter)
- `GET /api/projects/{id}` — project by id
- `POST /api/projects` — create project
- `PUT /api/projects/{id}` — update project
- `DELETE /api/projects/{id}` — delete project
- `POST /api/contact` — submit contact form
- `GET /api/contact/messages` — list contact messages (admin)

Example curl:

```bash
curl http://localhost:8000/api/profile
curl -X POST http://localhost:8000/api/contact -H "Content-Type: application/json" -d '{"name":"Me","email":"me@example.com","subject":"hi","message":"hello"}'
```

> Models are defined in `backend/models.py` (useful for integration tests or generating clients).

---

## Scripts & tests
Quick reference:

| Area | Command | What it does |
|---|---:|---|
| Frontend (dev) | `cd frontend && yarn start` | Runs CRA dev server (http://localhost:3000)
| Frontend (build) | `cd frontend && yarn build` | Production build to `frontend/build`
| Backend (dev) | `uvicorn backend.server:app --reload --port 8000` | Run FastAPI with autoreload
| Seed DB | `python backend/seed_database.py` | Populate example profile/skills/projects
| Backend tests | `pytest` (from repo root) | Runs backend test suite
| Lint / format | `black`, `isort`, `flake8`, `mypy` | Code quality checks (see `backend/requirements.txt`)

Run backend tests from repo root:

```powershell
# ensure venv activated
pytest -q
```

Run frontend tests:

```bash
cd frontend
yarn test
```

---

## Project structure (key files)

- `frontend/` — React app (components in `frontend/src/components/`)
- `backend/` — FastAPI app, Pydantic models, seed scripts
  - `backend/server.py` — API routes and app startup
  - `backend/models.py` — request/response models
  - `backend/seed_database.py` — seeds `profile`, `skills`, `projects`
- `prompts/` — meta/prompts used for repo automation
- `tests/` — project tests

---

## Development notes & tips 🔧
- Seed data is opinionated for demo purposes — delete or replace before production.
- If Mongo connection fails, confirm `MONGO_URL` and that MongoDB is running or reachable.
- FastAPI provides interactive docs at `/docs` when server is running.
- Use the Pydantic models in `backend/models.py` as a source of truth for integration tests or client generation.

---

## Contributing 🤝
- Open an issue for major changes or feature requests.
- For bug fixes or docs, create a branch, add tests, and open a PR against `main`.
- See `CONTRIBUTING.md` (if present) for the project's contribution workflow.

---

## Maintainer & support
- Maintainer: Gaurav Gaur (see `backend/seed_data.py` sample profile)
- For help: open an issue or discussion in this repository.

---

## License
This repository uses the `LICENSE` in the project root (if present). If you need a license, add an appropriate `LICENSE` file (MIT recommended for templates).

---

## Small roadmap / suggestions
- Add CI (lint/test) workflow badge
- Add Docker + docker-compose for an easy dev environment
- Add GitHub Pages / Vercel deployment example for the frontend

---

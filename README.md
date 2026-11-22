# Gaurav Gaur — Portfolio

Angular-developer portfolio: **React 19 + Tailwind** frontend, **FastAPI + MongoDB** backend, and seven playable in-app demos.

[![CI](https://github.com/MrGaurav370/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/MrGaurav370/Portfolio/actions/workflows/ci.yml)

## Live demos (all run in the browser, no backend needed)
| Route | Demo | Highlights |
|---|---|---|
| `/jarvis` | J.A.R.V.I.S. voice assistant | Web Speech API voice in/out, spoken math, voice navigation, optional local **Ollama** LLM fallback |
| `/dashboard` | Enterprise dashboard | Charts, KPIs, user table |
| `/elearning` | E-learning platform | Courses, progress, detail pages |
| `/shop` | Shopping cart | Catalogue, cart, checkout |
| `/tasks` | Task manager | Kanban drag & drop (+ touch buttons), search, saved locally |
| `/healthcare` | Healthcare portal | Appointment booking with double-booking protection, patient records, refill requests |
| `/weather` | Weather forecast | Live Open-Meteo data, city search, geolocation, hourly + 7-day, derived alerts, offline sample fallback |

Site-wide: **Ctrl/⌘+K command palette**, scroll-progress bar and a live **GitHub repos** section (hidden if GitHub is unreachable).

### J.A.R.V.I.S. with a local LLM
Open the demo → gear icon → enable Ollama. Start Ollama with `OLLAMA_ORIGINS=*` so the page may call it. Requests go only to your own machine.

## How it works
- The frontend works **with or without** the backend. With `REACT_APP_BACKEND_URL` set it loads profile/skills/projects from the API and posts the contact form there; without it (e.g. GitHub Pages) it uses `frontend/src/mock.js` and the contact form opens a pre-filled `mailto:`.
- The API auto-seeds itself from `backend/seed_data.py` when the database is empty.
- Write endpoints and the contact inbox need an `X-Admin-Key` header (`ADMIN_API_KEY`). The public contact endpoint is validated and rate-limited per IP.

## Run locally
```bash
# backend (needs MongoDB on localhost:27017)
cd backend && cp .env.example .env        # set ADMIN_API_KEY
pip install -r requirements-dev.txt
uvicorn server:app --reload --port 8000    # docs at /docs

# frontend
cd frontend && echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
yarn install && yarn start                 # http://localhost:3000
```
Or everything at once: `ADMIN_API_KEY=secret docker compose up --build`.

## API (`/api`)
| Method | Path | Auth |
|---|---|---|
| GET | `/health`, `/profile`, `/skills`, `/projects` (`?featured=true`), `/projects/{id}` | – |
| POST | `/contact` | – (rate limited) |
| PUT | `/profile` | admin |
| POST | `/skills`, `/projects` | admin |
| PUT / DELETE | `/projects/{id}` | admin |
| GET | `/contact/messages` | admin |

Details: [`contracts.md`](contracts.md).

## Tests
```bash
pip install -r backend/requirements-dev.txt && pytest -q   # 8 API tests, in-memory Mongo
cd frontend && yarn test --watchAll=false   # 22 tests: voice parser, kanban, booking, weather
cd frontend && yarn build
```

## Deploy
- **Frontend → GitHub Pages**: `.github/workflows/deploy-pages.yml` builds and publishes on every push to `main` (enable *Settings → Pages → Source: GitHub Actions*). `frontend/public/CNAME` keeps the custom domain; `404.html` makes deep links like `/shop` work. Optionally set a repo variable `BACKEND_URL` to use a hosted API.
- **Backend**: `backend/Dockerfile` runs anywhere (Render, Fly, Railway…) with `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `ADMIN_API_KEY`.

## Editing content
Change `backend/seed_data.py` + `frontend/src/mock.js` (or use the admin API once running). Projects with a `route` show a "View Live Demo" button; `demoUrl` / `githubUrl` buttons appear only when set.

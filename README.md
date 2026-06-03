# CodeCraft — AI Skills Verification Platform

> A full-stack platform for browsing and completing AI-generated coding challenges.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-codecraft--frontend--psi.vercel.app-blue?style=flat-square)](https://codecraft-frontend-psi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-ishaan1911%2Fcodecraft-181717?style=flat-square&logo=github)](https://github.com/ishaan1911/codecraft)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)

---

## What It Does

CodeCraft is a skills assessment platform where users can browse coding challenges by category and difficulty, submit solutions, and receive real-time feedback. The frontend is deployed on Vercel; the backend runs on Railway — a cross-origin deployment that required solving a non-trivial HTTPS mixed-content issue in production.

---

## Architecture

```
┌──────────────────────────────────────┐
│    React + TypeScript (Vercel)       │
│  Challenge Browse · Submit · Results │
└──────────────────┬───────────────────┘
                   │ HTTPS (cross-origin)
┌──────────────────▼───────────────────┐
│       FastAPI Backend (Railway)      │
│  Uvicorn + proxy-headers middleware  │
│  Challenges · Submissions · Results  │
└──────────────────────────────────────┘
```

---

## Key Features

- **Challenge browsing** — filterable by category (algorithms, data structures, system design) and difficulty level
- **Code submission flow** — users write and submit solutions directly in the browser; results return in real time
- **React Router navigation** — multi-page SPA with clean URL routing between challenge list, detail, and submission views
- **Cross-origin production deployment** — frontend on Vercel, backend on Railway; CORS and HTTPS handled correctly across both
- **Proxy header middleware** — FastAPI configured with Uvicorn's `--proxy-headers` flag and custom middleware to handle Railway's reverse proxy correctly, resolving an HTTPS mixed-content issue that blocked all API calls in production

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, React Router, Vercel |
| Backend | FastAPI, Python, Uvicorn |
| Deployment | Vercel (frontend) · Railway (backend) |
| DevOps | Docker, Git |

---

## The Deployment Problem Worth Noting

When deploying a React frontend on Vercel against a FastAPI backend on Railway, all API requests failed in production with a mixed-content error — the browser blocked HTTP requests from an HTTPS origin.

**Root cause:** Railway's reverse proxy was stripping the `X-Forwarded-Proto` header, so FastAPI was generating internal redirect URLs with `http://` even though the public-facing URL was `https://`. This caused the browser to block requests as insecure.

**Fix:**
```python
# main.py
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")
```

```bash
# Railway start command
uvicorn main:app --host 0.0.0.0 --port $PORT --proxy-headers
```

This correctly propagated the HTTPS scheme through Railway's proxy layer and resolved all cross-origin request failures.

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+

### Frontend

```bash
git clone https://github.com/ishaan1911/codecraft
cd codecraft/frontend

npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:8000

npm start
# Open http://localhost:3000
```

### Backend

```bash
cd codecraft/backend

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

---

## Environment Variables

```env
# Frontend
REACT_APP_API_URL=https://your-railway-backend-url

# Backend (Railway sets PORT automatically)
PORT=8000
```

---

## Project Structure

```
codecraft/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ChallengeList.tsx   # Browse + filter challenges
│   │   │   ├── ChallengeDetail.tsx # Problem statement + editor
│   │   │   └── Results.tsx         # Submission feedback
│   │   ├── components/
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── CodeEditor.tsx
│   │   │   └── FilterBar.tsx
│   │   └── router.tsx              # React Router config
└── backend/
    ├── main.py                     # FastAPI app + middleware
    ├── routers/
    │   ├── challenges.py           # Challenge CRUD
    │   └── submissions.py          # Submission + evaluation
    └── models/
        ├── challenge.py
        └── submission.py
```

---

## Author

**Ishaan Parekh** — [LinkedIn](https://www.linkedin.com/in/ishaan-parekh-19i112002) · [Portfolio](https://ishaanparekh.vercel.app) · [GitHub](https://github.com/ishaan1911)

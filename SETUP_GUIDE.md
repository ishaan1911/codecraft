# CodeCraft - Complete Setup Guide

## 📋 Overview

This guide will walk you through setting up CodeCraft locally and deploying it using free tier services.

## 🎯 Prerequisites

Before starting, ensure you have:
- **Node.js** 18+ and npm installed
- **Python** 3.11+ installed
- **Docker** and Docker Compose (for local development)
- **Git** for version control
- Code editor (VS Code recommended)

## 🚀 Quick Start (5 Minutes)

### 1. Clone or Download the Project

```bash
# If using git
git init
git add .
git commit -m "Initial commit"

# Or just cd into the project directory
cd codecraft
```

### 2. Set Up Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env

# Edit .env and add (for local development):
DATABASE_URL=postgresql://codecraft:codecraft@db:5432/codecraft
REDIS_URL=redis://redis:6379
SECRET_KEY=$(openssl rand -hex 32)  # Generate a secure key
ANTHROPIC_API_KEY=your-key-here
```

**Frontend (.env):**
```bash
cd ../frontend
cp .env.example .env

# Keep defaults for local:
REACT_APP_API_URL=http://localhost:8000
```

### 3. Start with Docker Compose (Easiest!)

```bash
# From project root
docker-compose up

# Or run in background:
docker-compose up -d
```

This will start:
- ✅ Backend API on http://localhost:8000
- ✅ Frontend on http://localhost:3000
- ✅ PostgreSQL database
- ✅ Redis cache

**Visit http://localhost:3000 to see your app!**

### 4. Alternative: Run Without Docker

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Make sure PostgreSQL and Redis are running locally
# Update DATABASE_URL and REDIS_URL in .env accordingly

uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 🌐 Free Tier Service Setup

### 1. Supabase (Database + Storage)

1. **Create Account**
   - Go to https://supabase.com
   - Click "Start your project"
   - Create new organization (free)

2. **Create Project**
   - Click "New Project"
   - Choose name: "codecraft"
   - Set strong database password
   - Select region closest to you
   - Wait ~2 minutes for setup

3. **Get Connection Details**
   - Go to Project Settings > Database
   - Copy "Connection string" (URI mode)
   - Example: `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres`

4. **Enable Storage**
   - Go to Storage in sidebar
   - Create bucket: "submissions"
   - Set to public or private as needed

5. **Update Backend .env**
   ```bash
   DATABASE_URL=your-supabase-connection-string
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_KEY=your-anon-key  # From Settings > API
   SUPABASE_SERVICE_KEY=your-service-key  # From Settings > API
   ```

### 2. Upstash (Redis Cache)

1. **Create Account**
   - Go to https://upstash.com
   - Sign up (free tier: 10,000 commands/day)

2. **Create Redis Database**
   - Click "Create Database"
   - Name: "codecraft-cache"
   - Type: Regional
   - Region: Choose closest to your Supabase
   - TLS: Enable

3. **Get Connection URL**
   - Click on your database
   - Copy "REST URL" or "Redis URL"
   - Add to backend .env:
   ```bash
   REDIS_URL=redis://default:[password]@[host]:6379
   ```

### 3. Anthropic API (for AI Grading)

1. **Get API Key**
   - Go to https://console.anthropic.com
   - Create account
   - Go to API Keys
   - Create new key

2. **Add to Backend .env**
   ```bash
   ANTHROPIC_API_KEY=sk-ant-...
   ```

### 4. Railway (Backend Deployment)

1. **Create Account**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # From backend directory
   cd backend
   railway init

   # Deploy
   railway up
   ```

3. **Add Environment Variables**
   - Go to railway.app dashboard
   - Select your project
   - Go to Variables tab
   - Add all variables from .env

4. **Get Backend URL**
   - Railway will give you a URL like: `codecraft-backend.up.railway.app`
   - Update frontend .env:
   ```bash
   REACT_APP_API_URL=https://codecraft-backend.up.railway.app
   ```

### 5. Vercel (Frontend Deployment)

1. **Push to GitHub**
   ```bash
   # Create GitHub repo first, then:
   git remote add origin https://github.com/yourusername/codecraft.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Root Directory: `frontend`
   - Framework Preset: Create React App
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://your-railway-backend-url
     ```
   - Click Deploy

3. **Your App is Live!**
   - Vercel will give you a URL: `codecraft.vercel.app`
   - Your app is now live on the internet! 🎉

## 🗄️ Database Setup

### Initialize Database Tables

**Option 1: Automatic (using Supabase)**
```bash
# Tables will be created automatically on first run
# SQLAlchemy will create all tables based on models
```

**Option 2: Manual SQL (if needed)**
```sql
-- Connect to Supabase SQL Editor and run:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    skill_level INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Challenges table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    code_snippet TEXT,
    language VARCHAR(50),
    test_cases JSONB,
    grading_criteria JSONB,
    time_limit INT NOT NULL,
    points INT NOT NULL,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id),
    user_id UUID REFERENCES users(id),
    code TEXT,
    explanation TEXT,
    video_url VARCHAR(500),
    score NUMERIC(5,2),
    max_score NUMERIC(5,2),
    is_correct BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    test_results JSONB,
    grading_details JSONB,
    time_taken INT,
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- Challenge attempts table
CREATE TABLE challenge_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id),
    user_id UUID REFERENCES users(id),
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE
);
```

## 🧪 Testing the Setup

### 1. Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Should return:
# {"status":"healthy","database":"connected","cache":"connected"}
```

### 2. Test Frontend

```bash
# Open browser
open http://localhost:3000

# You should see the CodeCraft homepage
```

### 3. Test Registration

```bash
# Using curl
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

## 📝 Adding Sample Data

Create a file `backend/seed_data.py`:

```python
from app.database import SessionLocal
from app.models import Challenge, ChallengeCategory, ChallengeDifficulty
from uuid import uuid4

db = SessionLocal()

# Create sample challenges
challenges = [
    {
        "title": "Explain the Decorator Pattern",
        "category": ChallengeCategory.COMPREHENSION,
        "difficulty": ChallengeDifficulty.MEDIUM,
        "description": "Explain what this Python decorator does and when you'd use it.",
        "code_snippet": """
def memoize(func):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper
        """,
        "language": "python",
        "time_limit": 15,
        "points": 50
    },
    {
        "title": "Fix the Memory Leak",
        "category": ChallengeCategory.DEBUGGING,
        "difficulty": ChallengeDifficulty.HARD,
        "description": "Find and fix the memory leak in this event listener code.",
        "code_snippet": """
class EventEmitter:
    def __init__(self):
        self.listeners = []
    
    def on(self, event, callback):
        self.listeners.append(callback)
    
    def emit(self, event):
        for callback in self.listeners:
            callback()
        """,
        "language": "python",
        "time_limit": 20,
        "points": 75
    }
]

for ch_data in challenges:
    challenge = Challenge(**ch_data)
    db.add(challenge)

db.commit()
print(f"Added {len(challenges)} sample challenges!")
```

Run with:
```bash
python seed_data.py
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection
psql postgresql://codecraft:codecraft@localhost:5432/codecraft
```

### Frontend Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port 3000 is free
lsof -i :3000
```

### Backend Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt

# Check Python version
python --version  # Should be 3.11+
```

## 📊 Monitoring

### View Logs

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Railway logs
railway logs

# Vercel logs
vercel logs
```

## 🔐 Security Checklist

Before going to production:

- [ ] Change SECRET_KEY to a strong random value
- [ ] Use environment variables for ALL secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Set up database backups on Supabase
- [ ] Enable 2FA on all service accounts
- [ ] Review and set rate limits
- [ ] Set up monitoring and alerts

## 📚 Next Steps

Now that your app is running:

1. **Week 1**: Implement authentication UI (Login/Register pages)
2. **Week 2**: Create challenge browsing and detail pages
3. **Week 3**: Build submission system and code editor
4. **Week 4**: Add grading service and feedback display

## 🆘 Getting Help

- **Documentation**: Check README.md for architecture details
- **Issues**: Create GitHub issues for bugs
- **API Docs**: Visit http://localhost:8000/docs for Swagger UI

---

**Congratulations!** 🎉 You now have CodeCraft running locally and know how to deploy it!

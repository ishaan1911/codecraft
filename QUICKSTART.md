# CodeCraft - Quick Start Guide

This guide will help you get CodeCraft running locally in under 15 minutes.

## Step 1: Clone and Setup

```bash
# Navigate to where you want the project
cd ~/projects  # or your preferred directory

# If you haven't already, the project is at /home/claude/codecraft
cd /home/claude/codecraft
```

## Step 2: Setup Free Tier Services

### Supabase (PostgreSQL Database)

1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Fill in:
   - Name: `codecraft`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)
5. Go to Settings > Database
6. Copy the "Connection string" (URI format)
7. Replace `[YOUR-PASSWORD]` with your actual password

### Upstash (Redis)

1. Go to https://upstash.com and sign up
2. Click "Create Database"
3. Fill in:
   - Name: `codecraft-cache`
   - Type: Regional
   - Region: Choose closest to you
4. Click "Create"
5. Copy the "UPSTASH_REDIS_REST_URL" from the details page

### Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Go to API Keys
4. Create a new key
5. Copy the key (starts with `sk-ant-`)

## Step 3: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env file and add your credentials
nano .env  # or use your preferred editor
```

Update these values in `.env`:
```env
DATABASE_URL=your-supabase-connection-string
REDIS_URL=your-upstash-redis-url
ANTHROPIC_API_KEY=your-anthropic-api-key
SECRET_KEY=your-random-secret-key-here  # Generate with: openssl rand -hex 32
```

```bash
# Initialize database
# First, let's create the database tables
python -c "from app.database import Base, engine; import asyncio; asyncio.run(Base.metadata.create_all(bind=engine))"

# Start the backend
python -m app.main
```

Backend should now be running at http://localhost:8000

## Step 4: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default values should work for local development
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

Frontend should now be running at http://localhost:3000

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create an account
3. Fill in the registration form
4. You should be redirected to the dashboard

## Troubleshooting

### Backend won't start

**Error: "No module named 'app'"**
- Make sure you're in the `backend` directory
- Make sure your virtual environment is activated
- Run `pip install -r requirements.txt` again

**Error: "Connection refused" (Database)**
- Check your `DATABASE_URL` is correct
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Test connection: `psql your-database-url`

### Frontend won't start

**Error: "Cannot find module"**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**Error: "Network error" when trying to login**
- Make sure backend is running at http://localhost:8000
- Check `VITE_API_URL` in frontend `.env`

### Database migrations

If you need to reset the database:

```bash
# In backend directory with venv activated
python -c "from app.database import Base, engine; import asyncio; asyncio.run(Base.metadata.drop_all(bind=engine))"
python -c "from app.database import Base, engine; import asyncio; asyncio.run(Base.metadata.create_all(bind=engine))"
```

## Next Steps

1. Check out the challenges page (coming soon in Phase 1)
2. Review the README.md for the full development roadmap
3. Start implementing Week 1 tasks from the roadmap

## Need Help?

- Check the main README.md
- Review the API documentation at http://localhost:8000/docs
- Check GitHub issues

Happy coding! 🚀

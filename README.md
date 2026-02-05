# CodeCraft - AI Skills Verification Platform

A platform for developers to prove engineering skills that AI coding assistants can't replicate.

## Features

- **Code Comprehension Challenges**: Prove you understand complex code
- **Debugging Arena**: Find and fix bugs AI tools miss
- **AI Code Review**: Audit AI-generated code for vulnerabilities
- **Verified Portfolio**: Public profile showcasing your skills
- **Leaderboard**: Compete with other developers

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL (Supabase)
- Redis (Upstash)
- Anthropic Claude API

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router

### Deployment
- Backend: Railway
- Frontend: Vercel
- Database: Supabase (PostgreSQL)
- Cache: Upstash (Redis)

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

5. Update environment variables in `.env`

6. Run database migrations:
```bash
alembic upgrade head
```

7. Start the server:
```bash
python -m app.main
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Free Tier Services Setup

### 1. Supabase (PostgreSQL)
1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Copy the connection string (Settings > Database)
4. Update `DATABASE_URL` in backend `.env`

### 2. Upstash (Redis)
1. Go to [upstash.com](https://upstash.com) and create account
2. Create new Redis database
3. Copy the connection string
4. Update `REDIS_URL` in backend `.env`

### 3. Anthropic API
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Update `ANTHROPIC_API_KEY` in backend `.env`

### 4. Railway (Backend Hosting)
1. Go to [railway.app](https://railway.app) and create account
2. Create new project
3. Connect your GitHub repository
4. Add environment variables from `.env.example`
5. Deploy

### 5. Vercel (Frontend Hosting)
1. Go to [vercel.com](https://vercel.com) and create account
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add `VITE_API_URL` environment variable
5. Deploy

## Project Structure

```
codecraft/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities
│   │   ├── stores/       # State management
│   │   └── types/        # TypeScript types
│   └── package.json
└── README.md
```

## Development Roadmap

### Phase 1: MVP (Weeks 1-4)
- [x] Project setup
- [ ] Authentication system
- [ ] Challenge browsing
- [ ] Basic submission system
- [ ] Grading service

### Phase 2: Enhancement (Weeks 5-6)
- [ ] Video recording
- [ ] AI code review challenges
- [ ] Achievement system
- [ ] Leaderboard

### Phase 3: Growth (Weeks 7-8)
- [ ] Admin dashboard
- [ ] User analytics
- [ ] Social features
- [ ] Challenge recommendations

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License

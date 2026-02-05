-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE challenge_category AS ENUM ('comprehension', 'debugging', 'ai_review', 'design', 'security');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE challenge_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better query performance
-- These will be created automatically by SQLAlchemy, but we can add them here too

-- Add any custom functions or triggers here if needed

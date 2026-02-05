// User types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  skill_level: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Challenge types
export type ChallengeCategory = 'comprehension' | 'debugging' | 'ai_review' | 'design' | 'security';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  description: string;
  code_snippet?: string;
  language?: string;
  time_limit: number;
  points: number;
  created_at: string;
  is_active: boolean;
}

// Submission types
export interface Submission {
  id: string;
  challenge_id: string;
  user_id: string;
  code?: string;
  explanation?: string;
  video_url?: string;
  score?: number;
  max_score?: number;
  is_correct: boolean;
  feedback?: string;
  test_results?: any;
  grading_details?: Record<string, any>;  // ← Add this line
  time_taken?: number;
  submitted_at: string;
}

export interface SubmissionCreate {
  challenge_id: string;
  code?: string;
  explanation?: string;
}

// API Response types
export interface ApiError {
  detail: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

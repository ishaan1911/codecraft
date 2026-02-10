import api from './api';

export interface Challenge {
  id: number;
  title: string;
  description: string;
  category: 'comprehension' | 'debugging' | 'security';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  code_snippet?: string;
  question?: string;
  test_cases?: any;
  created_at?: string;
  updated_at?: string;
}

export const challengesService = {
  /**
   * Get all challenges
   */
  async getAllChallenges(): Promise<Challenge[]> {
    const response = await api.get('/challenges/');
    return response.data;
  },

  /**
   * Get a single challenge by ID
   */
  async getChallenge(id: number): Promise<Challenge> {
    const response = await api.get(`/challenges/${id}/`);
    return response.data;
  },

  /**
   * Filter challenges by category and/or difficulty
   */
  async filterChallenges(
    category?: string,
    difficulty?: string
  ): Promise<Challenge[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    const response = await api.get(`/challenges/?${params.toString()}`);
    return response.data;
  },
};
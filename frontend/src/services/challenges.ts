import api from './api';
import { Challenge, ChallengeCategory, ChallengeDifficulty } from '../types';

export const challengeService = {
  async list(
    category?: ChallengeCategory,
    difficulty?: ChallengeDifficulty
  ): Promise<Challenge[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    const response = await api.get<Challenge[]>(`/challenges?${params.toString()}`);
    return response.data;
  },

  async get(id: string): Promise<Challenge> {
    const response = await api.get<Challenge>(`/challenges/${id}`);
    return response.data;
  },
};
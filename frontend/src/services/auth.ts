import api from './api';
import { User, UserCreate, UserLogin, Token } from '../types';

export const authService = {
  async register(userData: UserCreate): Promise<User> {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  },

  async login(credentials: UserLogin): Promise<Token> {
    const response = await api.post<Token>('/auth/login', credentials);
    const { access_token } = response.data;
    
    // Store token
    localStorage.setItem('access_token', access_token);
    
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};

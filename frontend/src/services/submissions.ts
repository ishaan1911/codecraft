import api from './api';
import { Submission, SubmissionCreate } from '../types';

export const submissionService = {
  async create(submissionData: SubmissionCreate): Promise<Submission> {
    const response = await api.post<Submission>('/submissions', submissionData);
    return response.data;
  },

  async list(): Promise<Submission[]> {
    const response = await api.get<Submission[]>('/submissions');
    return response.data;
  },

  async get(id: string): Promise<Submission> {
    const response = await api.get<Submission>(`/submissions/${id}`);
    return response.data;
  },
};
import { apiClient } from '@/lib/api-client';
import type { User } from '@/types/api';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (input: LoginInput) =>
    apiClient.post<AuthResponse>('/auth/login', input).then((r) => r.data),
  register: (input: RegisterInput) =>
    apiClient.post<AuthResponse>('/auth/register', input).then((r) => r.data),
  me: () => apiClient.get<{ user: User }>('/auth/me').then((r) => r.data.user),
};

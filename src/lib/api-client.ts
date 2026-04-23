import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { env } from './env';

const TOKEN_KEY = 'actividades.citizen.token';

export const tokenStorage = {
  get: (): string | null =>
    typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY),
  set: (token: string) => window.localStorage.setItem(TOKEN_KEY, token),
  clear: () => window.localStorage.removeItem(TOKEN_KEY),
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: { code?: string; message?: string } }>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      tokenStorage.clear();
    }
    return Promise.reject(error);
  },
);

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }

  static from(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { error?: { code?: string; message?: string } } | undefined;
      return new ApiError(
        error.response?.status ?? 0,
        data?.error?.code ?? 'NETWORK_ERROR',
        data?.error?.message ?? error.message,
      );
    }
    return new ApiError(0, 'UNKNOWN_ERROR', (error as Error).message);
  }
}

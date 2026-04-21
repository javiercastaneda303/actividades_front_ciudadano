'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginInput, type RegisterInput } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/lib/api-client';

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: ({ user, token }) => setAuth(user, token),
    onError: (err) => {
      throw ApiError.from(err);
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: ({ user, token }) => setAuth(user, token),
    onError: (err) => {
      throw ApiError.from(err);
    },
  });
};

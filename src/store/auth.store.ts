import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/api';
import { tokenStorage } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        tokenStorage.set(token);
        set({ user, isAuthenticated: true });
      },
      clear: () => {
        tokenStorage.clear();
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'fiestas.citizen.auth', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) },
  ),
);

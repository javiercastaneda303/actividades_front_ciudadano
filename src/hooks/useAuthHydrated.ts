'use client';

import { useSyncExternalStore } from 'react';
import { useAuthStore } from '@/store/auth.store';

const subscribe = (callback: () => void) =>
  useAuthStore.persist.onFinishHydration(callback);
const getSnapshot = () => useAuthStore.persist.hasHydrated();
const getServerSnapshot = () => false;

export function useAuthHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

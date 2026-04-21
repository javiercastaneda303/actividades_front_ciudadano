'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useAuthStore.persist.hasHydrated());
    return unsubFinish;
  }, []);

  return hydrated;
}

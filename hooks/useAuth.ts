'use client';

import { useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth/client';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const state = useAuthStore();

  useEffect(() => {
    let active = true;
    state.setLoading(true);
    getCurrentUser()
      .then((user) => {
        if (active) state.setUser(user);
      })
      .catch(() => {
        if (active) state.setUser(null);
      })
      .finally(() => {
        if (active) state.setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

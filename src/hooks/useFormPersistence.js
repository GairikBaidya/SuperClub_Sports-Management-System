import { useCallback } from 'react';
import { LOCAL_STORAGE_KEY } from '../lib/constants';

/**
 * useFormPersistence — read/write multi-step form data to localStorage.
 */
export function useFormPersistence() {
  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const save = useCallback((data) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // quota exceeded — silently fail
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  return { load, save, clear };
}

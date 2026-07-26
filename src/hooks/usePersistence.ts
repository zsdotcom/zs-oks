import { useEffect, useRef, useCallback } from 'react';
import { dbPut, dbGetAll, dbDelete, dbGet, dbSetKey, dbGetKey } from '../db/indexedDB';
import type { DBSchema } from '../db/indexedDB';

type StoreName = keyof DBSchema;

export function useSaveToDB<T extends { id: string }>(
  storeName: StoreName,
  data: T[],
  delay: number = 500
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      data.forEach((item) => dbPut(storeName, item).catch(() => {}));
    }, delay);
    return () => clearTimeout(timerRef.current);
  }, [data, storeName, delay]);
}

export function useLoadFromDB<T extends { id: string }>(
  storeName: StoreName,
  onLoaded: (items: T[]) => void
) {
  useEffect(() => {
    dbGetAll<T>(storeName).then((items) => {
      if (items.length > 0) onLoaded(items);
    }).catch(() => {});
  }, [storeName]);
}

export function useDarkMode(): [boolean, (v: boolean) => void] {
  const KEY = 'oks_dark_mode';
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
  const initial = stored !== null ? stored === 'true' : true;

  useEffect(() => {
    if (initial) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, []);

  const setDarkMode = useCallback((v: boolean) => {
    if (v) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem(KEY, String(v));
  }, []);

  return [initial, setDarkMode];
}

export function useOnlineStatus(): boolean {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  return isOnline;
}

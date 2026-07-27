import { useState, useCallback, useRef } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

let globalDispatch: ((n: Omit<Notification, 'id'>) => void) | null = null;

export function notify(n: Omit<Notification, 'id'>): void {
  globalDispatch?.(n);
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const counterRef = useRef(0);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = `notif-${++counterRef.current}`;
    const notif: Notification = { ...n, id };
    setNotifications((prev) => [...prev.slice(-4), notif]);
    const dur = n.duration ?? 4000;
    if (dur > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.filter((x) => x.id !== id));
        timersRef.current.delete(id);
      }, dur);
      timersRef.current.set(id, timer);
    }
    return id;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); timersRef.current.delete(id); }
  }, []);

  globalDispatch = addNotification;

  return { notifications, addNotification, dismissNotification };
}

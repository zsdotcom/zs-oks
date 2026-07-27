import React from 'react';
import type { Notification } from '../hooks/useNotifications';
import { X, Check, AlertTriangle, Bell } from './icons/lucide-shim';

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const ICONS: Record<Notification['type'], React.ReactNode> = {
  success: <Check size={14} className="text-green-400" />,
  error: <AlertTriangle size={14} className="text-red-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  info: <Bell size={14} className="text-cyan-400" />,
};

const COLORS: Record<Notification['type'], string> = {
  success: 'border-green-500/30',
  error: 'border-red-500/30',
  warning: 'border-amber-500/30',
  info: 'border-cyan-500/30',
};

export const ToastContainer: React.FC<Props> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;
  return (
    <div className="fixed bottom-14 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-start gap-2 p-3 rounded-lg bg-(--bg-secondary) border ${COLORS[n.type]} shadow-lg animate-slide-up`}
        >
          <span className="mt-0.5 shrink-0">{ICONS[n.type]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-(--text-primary)">{n.title}</p>
            {n.message && <p className="text-[10px] text-(--text-muted) mt-0.5">{n.message}</p>}
          </div>
          <button onClick={() => onDismiss(n.id)} className="p-0.5 rounded hover:bg-(--bg-hover) text-(--text-muted) shrink-0">
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

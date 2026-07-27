import React from 'react';
import { X } from './icons/lucide-shim';

interface Props {
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: 'Cmd+K / Ctrl+K', desc: 'Toggle search overlay' },
  { keys: 'Escape', desc: 'Close search/help overlay' },
  { keys: 'Enter', desc: 'Send message (chat input)' },
  { keys: 'Shift+Enter', desc: 'New line (chat input)' },
  { keys: 'Cmd+Enter / Ctrl+Enter', desc: 'Send message (chat input)' },
  { keys: 'Ctrl+/', desc: 'Toggle this help dialog' },
];

const ShortcutsHelp: React.FC<Props> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
    <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-2xl w-96 max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <span className="text-sm font-medium">Keyboard Shortcuts</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-hover)]" aria-label="Close shortcuts">
          <X size={16} />
        </button>
      </div>
      <div className="p-4 space-y-2">
        {SHORTCUTS.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">{s.desc}</span>
            <kbd className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-[10px]">{s.keys}</kbd>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ShortcutsHelp;

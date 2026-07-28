import React from 'react';
import { computeDiff } from '../utils/diff';
import { X } from './icons/lucide-shim';

interface Props {
  oldText: string;
  newText: string;
  oldLabel?: string;
  newLabel?: string;
  onClose?: () => void;
}

const LINE_COLORS: Record<string, string> = {
  unchanged: '',
  added: 'bg-green-500/10',
  removed: 'bg-red-500/10',
};

const GUTTER_COLORS: Record<string, string> = {
  unchanged: 'text-[var(--text-muted)]',
  added: 'bg-green-500/20 text-green-400',
  removed: 'bg-red-500/20 text-red-400',
};

const DiffView: React.FC<Props> = ({ oldText, newText, oldLabel = 'Old', newLabel = 'New', onClose }) => {
  const lines = computeDiff(oldText, newText);
  const additions = lines.filter((l) => l.type === 'added').length;
  const removals = lines.filter((l) => l.type === 'removed').length;
  const unchanged = lines.filter((l) => l.type === 'unchanged').length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium">Diff</span>
          <span className="text-green-400">+{additions}</span>
          <span className="text-red-400">-{removals}</span>
          <span className="text-[var(--text-muted)]">{unchanged} unchanged</span>
          <span className="text-[var(--text-muted)]">| {lines.length} lines</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-hover)]" aria-label="Close diff">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto font-mono text-[11px] leading-relaxed">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--bg-secondary)] sticky top-0">
              <th className="w-12 text-right px-2 py-1 text-[10px] text-[var(--text-muted)] border-r border-[var(--border)]">{oldLabel}</th>
              <th className="w-12 text-right px-2 py-1 text-[10px] text-[var(--text-muted)] border-r border-[var(--border)]">{newLabel}</th>
              <th className="px-3 py-1 text-left text-[10px] text-[var(--text-muted)]">Content</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className={`${LINE_COLORS[line.type]} hover:brightness-110`}>
                <td className={`w-12 text-right px-2 py-0.5 text-[10px] border-r border-[var(--border)] ${line.type === 'added' ? 'text-[var(--text-muted)]' : GUTTER_COLORS[line.type]}`}>
                  {line.oldLine ?? ''}
                </td>
                <td className={`w-12 text-right px-2 py-0.5 text-[10px] border-r border-[var(--border)] ${line.type === 'removed' ? 'text-[var(--text-muted)]' : GUTTER_COLORS[line.type]}`}>
                  {line.newLine ?? ''}
                </td>
                <td className={`px-3 py-0.5 whitespace-pre-wrap ${line.type === 'added' ? 'text-green-400' : line.type === 'removed' ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}{line.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiffView;

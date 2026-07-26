import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Check } from './icons/lucide-shim';

interface Props {
  theme: string;
  onThemeChange: (theme: string) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

const THEMES = [
  { id: 'dark', label: 'Dark', icon: <Moon size={12} />, bg: '#1a1a2e' },
  { id: 'light', label: 'Light', icon: <Sun size={12} />, bg: '#f1f5f9' },
  { id: 'sepia', label: 'Sepia', icon: <span className="text-[11px] opacity-70">📜</span>, bg: '#f5e6d3' },
  { id: 'forest', label: 'Forest', icon: <span className="text-[11px] opacity-70">🌲</span>, bg: '#0f2a18' },
  { id: 'ocean', label: 'Ocean', icon: <span className="text-[11px] opacity-70">🌊</span>, bg: '#132743' },
  { id: 'midnight', label: 'Midnight', icon: <span className="text-[11px] opacity-70">🌙</span>, bg: '#0d0d20' },
  { id: 'solarized', label: 'Solarized', icon: <span className="text-[11px] opacity-70">☀️</span>, bg: '#EEE8D5' },
];

const ACCENT_COLORS = ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#14B8A6', '#22C55E', '#10B981', '#84CC16', '#F59E0B', '#F97316', '#EF4444', '#EC4899'];

const ThemeSwitcher: React.FC<Props> = ({ theme, onThemeChange, accentColor, onAccentColorChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
        aria-label="Toggle theme"
        aria-expanded={open}
        aria-controls="theme-panel"
        style={{ color: 'var(--text-secondary)' }}
      >
        {currentTheme.icon}
      </button>

      {open && (
        <div
          id="theme-panel"
          className="absolute right-0 top-full mt-1 w-64 rounded-xl shadow-2xl p-3 z-50 border"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', boxShadow: '0 10px 40px var(--shadow)' }}
          role="dialog"
          aria-label="Theme settings"
          aria-modal="true"
        >
          <div className="text-[10px] mb-2 font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Theme</div>
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { onThemeChange(t.id); setOpen(false); }}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] transition-all border"
                style={{
                  backgroundColor: theme === t.id ? 'var(--accent-subtle)' : 'transparent',
                  borderColor: theme === t.id ? 'var(--accent)' : 'var(--border)',
                  color: theme === t.id ? 'var(--accent)' : 'var(--text-secondary)',
                }}
                aria-label={`Switch to ${t.label} theme`}
                aria-pressed={theme === t.id}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full" style={{ backgroundColor: t.bg }}>
                  {theme === t.id && <Check size={8} className="text-white" />}
                  {theme !== t.id && t.icon}
                </span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="text-[10px] mb-1.5 font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Accent</div>
            <div className="flex gap-1.5 flex-wrap">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onAccentColorChange(c)}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                  aria-label={`Set accent color to ${c}`}
                  aria-pressed={accentColor === c}
                >
                  {accentColor === c && <Check size={10} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;

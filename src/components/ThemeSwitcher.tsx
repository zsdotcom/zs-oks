import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Check } from './icons/lucide-shim';

interface Props {
  theme: string;
  onThemeChange: (theme: string) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

const THEMES = [
  { id: 'dark', label: 'Dark', icon: <Moon size={12} /> },
  { id: 'light', label: 'Light', icon: <Sun size={12} /> },
  { id: 'sepia', label: 'Sepia', icon: <span className="text-[11px]">📜</span> },
  { id: 'forest', label: 'Forest', icon: <span className="text-[11px]">🌲</span> },
  { id: 'ocean', label: 'Ocean', icon: <span className="text-[11px]">🌊</span> },
];

const ACCENT_COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16', '#3B82F6', '#22C55E'];

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
        className="p-1.5 rounded-lg hover:bg-[#2a2a3e] transition-colors"
        aria-label="Toggle theme"
        aria-expanded={open}
        aria-controls="theme-panel"
      >
        {currentTheme.icon}
      </button>

      {open && (
        <div id="theme-panel" className="absolute right-0 top-full mt-1 w-56 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl shadow-2xl p-3 z-50" role="dialog" aria-label="Theme settings" aria-modal="true">
          <div className="text-[10px] text-gray-500 mb-2 font-medium">Theme</div>
          <div className="grid grid-cols-5 gap-1 mb-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { onThemeChange(t.id); setOpen(false); }}
                className={`flex flex-col items-center gap-0.5 p-1.5 rounded text-[10px] ${theme === t.id ? 'bg-indigo-500/20 ring-1 ring-indigo-500' : 'hover:bg-[#2a2a3e]'}`}
                aria-label={`Switch to ${t.label} theme`}
                aria-pressed={theme === t.id}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-[#2a2a3e] pt-2">
            <div className="text-[10px] text-gray-500 mb-1.5 font-medium">Accent Color</div>
            <div className="flex gap-1 flex-wrap">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onAccentColorChange(c)}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: c }}
                  aria-label={`Set accent color to ${c}`}
                  aria-pressed={accentColor === c}
                >
                  {accentColor === c && <Check size={10} className="text-white" />}
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

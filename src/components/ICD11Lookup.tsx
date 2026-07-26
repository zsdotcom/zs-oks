import React, { useState, useCallback, useRef, useEffect } from 'react';
import { searchICD11, getAllICD11Codes, ICD11Entry } from '../services/icd11Service';
import { X, Search, ChevronDown, ChevronRight } from './icons/lucide-shim';

interface ICD11LookupProps {
  onSelect?: (entry: ICD11Entry) => void;
  initialQuery?: string;
  onClose?: () => void;
}

export const ICD11Lookup: React.FC<ICD11LookupProps> = ({ onSelect, initialQuery = '', onClose }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ICD11Entry[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!value.trim()) {
        setResults([]);
        return;
      }
      setResults(searchICD11(value));
    }, 300);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const allCodes = getAllICD11Codes();
  const chapters = [...new Set(allCodes.map((c) => c.chapter))];

  const handleSelect = (entry: ICD11Entry) => {
    onSelect?.(entry);
    setQuery(`${entry.code} — ${entry.title}`);
    setResults([]);
    setShowAll(false);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setShowAll(false);
    inputRef.current?.focus();
  };

  const toggleChapter = (chapter: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapter)) next.delete(chapter);
      else next.add(chapter);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2a3e] shrink-0">
        <h2 className="text-xs font-semibold flex items-center gap-1.5">
          <span className="text-indigo-400">
            <Search size={12} />
          </span>
          ICD-11 Code Lookup
        </h2>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-[#2a2a3e] text-gray-400">
            <X size={12} />
          </button>
        )}
      </div>

      <div className="p-2 border-b border-[#2a2a3e] shrink-0">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by code, title, chapter..."
            className="w-full pl-7 pr-7 py-1.5 text-xs bg-[#0f0f1a] border border-[#2a2a3e] rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
          />
          {query && (
            <button onClick={clear} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => { setShowAll(!showAll); setResults([]); }}
            className={`text-[10px] px-2 py-1 rounded transition-colors ${showAll ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {showAll ? 'Hide all codes' : 'Show all codes'}
          </button>
          {results.length > 0 && (
            <span className="text-[10px] text-gray-500">{results.length} result{results.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showAll && (
          <div className="p-2 space-y-1">
            {chapters.map((chapter) => {
              const chapterCodes = allCodes.filter((c) => c.chapter === chapter);
              const isExpanded = expandedChapters.has(chapter);
              return (
                <div key={chapter} className="rounded border border-[#2a2a3e] overflow-hidden">
                  <button
                    onClick={() => toggleChapter(chapter)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-300 hover:bg-[#2a2a3e] transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                    <span className="font-medium truncate">{chapter}</span>
                    <span className="ml-auto text-[10px] text-gray-500">{chapterCodes.length}</span>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#2a2a3e]">
                      {chapterCodes.map((entry) => (
                        <button
                          key={entry.code}
                          onClick={() => handleSelect(entry)}
                          className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-[#2a2a3e] transition-colors border-b border-[#2a2a3e]/50 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-indigo-400 font-medium">{entry.code}</span>
                            <span className="text-gray-200">{entry.title}</span>
                          </div>
                          <p className="text-gray-500 mt-0.5 truncate">{entry.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {results.length > 0 && !showAll && (
          <div className="divide-y divide-[#2a2a3e]/50">
            {results.map((entry) => (
              <button
                key={entry.code}
                onClick={() => handleSelect(entry)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[#2a2a3e] transition-colors"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-indigo-400 font-medium text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10">{entry.code}</span>
                  <span className="text-gray-200 font-medium">{entry.title}</span>
                </div>
                <p className="text-[10px] text-gray-500 truncate">{entry.chapter}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{entry.description}</p>
              </button>
            ))}
          </div>
        )}

        {!showAll && results.length === 0 && query && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs">
            <Search size={24} className="mb-2 opacity-30" />
            <p>No codes found for "{query}"</p>
          </div>
        )}

        {!showAll && results.length === 0 && !query && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs px-4 text-center">
            <p className="mb-1">Search ICD-11 codes by entering a code, disease name, or chapter.</p>
            <p className="text-[10px] text-gray-600">Or click "Show all codes" to browse by chapter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

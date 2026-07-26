import React, { useState, useEffect } from 'react';
import { KBFile } from '../types';
import { SearchResult, buildSearchIndex, searchAll, clearSearchIndex } from '../services/searchService';
import { Search, FileText, X, Code, Brain, MessageSquare, RefreshCw } from './icons/lucide-shim';

interface Props {
  files: KBFile[];
  tags: any[];
  onFileSelect: (file: KBFile) => void;
}

const sourceIcons: Record<SearchResult['source'], React.ReactNode> = {
  file: <FileText size={12} className="text-indigo-400" />,
  memory: <Brain size={12} className="text-purple-400" />,
  code: <Code size={12} className="text-emerald-400" />,
  chat: <MessageSquare size={12} className="text-amber-400" />,
};

const sourceColors: Record<SearchResult['source'], string> = {
  file: 'bg-indigo-500/20 text-indigo-400',
  memory: 'bg-purple-500/20 text-purple-400',
  code: 'bg-emerald-500/20 text-emerald-400',
  chat: 'bg-amber-500/20 text-amber-400',
};

const SearchPanel: React.FC<Props> = ({ files, onFileSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);

  const initIndex = async () => {
    setIsRebuilding(true);
    await buildSearchIndex();
    setIsRebuilding(false);
  };

  useEffect(() => {
    initIndex();
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const r = searchAll(query.trim());
      setResults(r);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    if (result.source === 'file') {
      const file = files.find((f) => f.id === result.id);
      if (file) onFileSelect(file);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsFocused(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 border-b border-[#2a2a3e]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search all documents... (Ctrl+K)"
            className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 placeholder-gray-500"
            autoFocus
            aria-label="Search documents"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-300">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-gray-600">{files.length} files indexed</span>
          <button
            onClick={initIndex}
            disabled={isRebuilding}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 disabled:opacity-50"
            title="Rebuild search index from database"
          >
            <RefreshCw size={10} className={isRebuilding ? 'animate-spin' : ''} />
            {isRebuilding ? 'Rebuilding...' : 'Rebuild'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2" aria-live="polite" aria-label="Search results">
        {query.trim().length < 2 ? (
          <div className="text-center py-8 text-gray-500">
            <Search size={24} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Type at least 2 characters to search</p>
            {results.length === 0 && query.trim().length >= 2 && (
              <p className="text-xs mt-2">No results found for "{query}"</p>
            )}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-xs">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="space-y-1">
            {results.map((r) => (
              <button
                key={`${r.source}-${r.id}`}
                onClick={() => handleSelect(r)}
                className="w-full text-left p-2 rounded-lg hover:bg-[#2a2a3e] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0">{sourceIcons[r.source]}</span>
                  <span className="text-xs font-medium truncate flex-1">{r.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${sourceColors[r.source]}`}>{r.source}</span>
                </div>
                {r.snippet && (
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{r.snippet}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-12 bg-[#2a2a3e] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${r.relevance}%`,
                          background: r.relevance > 70 ? '#10B981' : r.relevance > 40 ? '#F59E0B' : '#6B7280',
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">{r.relevance}%</span>
                  </div>
                  {r.date && <span className="text-[10px] text-gray-600">{formatDate(r.date)}</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;

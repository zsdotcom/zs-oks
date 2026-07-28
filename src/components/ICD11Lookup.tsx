import React, { useState, useCallback, useRef, useEffect } from 'react';
import { searchICD11WithFallback, getAllICD11Codes, icd11ToFHIR, type ICD11Entry } from '../services/icd11Service';
import { searchICF, getAllICFCodes, type ICFEntry } from '../services/icfService';
import { searchICHI, getAllICHICodes, type ICHIEntry } from '../services/ichiService';
import type { WhoFicType } from '../services/whoFicIndex';
import { X, Search, ChevronDown, ChevronRight, Copy } from './icons/lucide-shim';

type ClassificationType = WhoFicType;

const CLASSIFICATION_LABELS: Record<ClassificationType, string> = {
  icd11: 'ICD-11',
  icf: 'ICF',
  ichi: 'ICHI',
};

interface ClassificationInfo {
  title: string;
  searchPlaceholder: string;
}

const CLASSIFICATION_INFO: Record<ClassificationType, ClassificationInfo> = {
  icd11: { title: 'ICD-11 Code Lookup', searchPlaceholder: 'Search by code, title, chapter...' },
  icf: { title: 'ICF Code Lookup', searchPlaceholder: 'Search by code, title, component...' },
  ichi: { title: 'ICHI Code Lookup', searchPlaceholder: 'Search by code, title, section...' },
};

interface ICD11LookupProps {
  onSelect?: (entry: ICD11Entry) => void;
  initialQuery?: string;
  onClose?: () => void;
  classificationType?: ClassificationType;
  onClassificationChange?: (type: ClassificationType) => void;
}

const icd11Chapters = [...new Set(getAllICD11Codes().map((c) => c.chapter))];
const icfComponents = [...new Set(getAllICFCodes().map((c) => c.chapter))] as string[];
const ichiSections = [...new Set(getAllICHICodes().map((c) => c.chapter))] as string[];

export const ICD11Lookup: React.FC<ICD11LookupProps> = ({
  onSelect,
  initialQuery = '',
  onClose,
  classificationType: externalType,
  onClassificationChange,
}) => {
  const [internalType, setInternalType] = useState<ClassificationType>('icd11');
  const classificationType = externalType ?? internalType;
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<(ICD11Entry | ICFEntry | ICHIEntry)[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const PAGE_SIZE = 20;
  const [selectedEntry, setSelectedEntry] = useState<ICD11Entry | null>(null);
  const [fhirCopied, setFhirCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (type: ClassificationType) => {
    setInternalType(type);
    onClassificationChange?.(type);
    setQuery('');
    setResults([]);
    setShowAll(false);
    setSelectedEntry(null);
    setFhirCopied(false);
  };

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!value.trim()) {
        setResults([]);
        return;
      }
      let res: (ICD11Entry | ICFEntry | ICHIEntry)[] = [];
      if (classificationType === 'icd11') res = await searchICD11WithFallback(value);
      else if (classificationType === 'icf') res = searchICF(value);
      else if (classificationType === 'ichi') res = searchICHI(value);
      setResults(res);
    }, 300);
  }, [classificationType]);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [classificationType]);

  const allCodes =
    classificationType === 'icd11' ? getAllICD11Codes() :
    classificationType === 'icf' ? getAllICFCodes() :
    classificationType === 'ichi' ? getAllICHICodes() :
    [];

  const chapters =
    classificationType === 'icd11' ? icd11Chapters :
    classificationType === 'icf' ? icfComponents :
    classificationType === 'ichi' ? ichiSections :
    [];

  const handleSelect = (entry: ICD11Entry | ICFEntry | ICHIEntry) => {
    onSelect?.(entry);
    setSelectedEntry(entry);
    setQuery(`${entry.code} — ${entry.title}`);
    setResults([]);
    setShowAll(false);
    setFhirCopied(false);
  };

  const handleFHIRExport = () => {
    if (!selectedEntry) return;
    const fhir = icd11ToFHIR(selectedEntry);
    navigator.clipboard.writeText(JSON.stringify(fhir, null, 2)).then(() => {
      setFhirCopied(true);
      setTimeout(() => setFhirCopied(false), 2000);
    }).catch(() => {});
  };

  const clearSelection = () => {
    setSelectedEntry(null);
    clear();
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
      if (next.has(chapter)) { next.delete(chapter); return next; }
      next.add(chapter);
      return next;
    });
    setVisibleCounts((prev) => ({ ...prev, [chapter]: PAGE_SIZE }));
  };

  const showMoreCodes = (chapter: string) => {
    setVisibleCounts((prev) => ({ ...prev, [chapter]: (prev[chapter] || PAGE_SIZE) + PAGE_SIZE }));
  };

  const info = CLASSIFICATION_INFO[classificationType];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]" role="dialog" aria-label={`${info.title} code lookup`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] shrink-0">
        <h2 className="text-xs font-semibold flex items-center gap-1.5">
          <span className="text-[var(--accent)]">
            <Search size={12} />
          </span>
          {info.title}
        </h2>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]">
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex border-b border-[var(--border)] shrink-0">
        {(Object.keys(CLASSIFICATION_LABELS) as ClassificationType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`flex-1 text-[10px] py-1.5 font-medium transition-colors ${
              classificationType === type
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {CLASSIFICATION_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="p-2 border-b border-[var(--border)] shrink-0">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={info.searchPlaceholder}
            className="w-full pl-7 pr-7 py-1.5 text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]/50"
          />
          {query && (
            <button onClick={clear} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => { setShowAll(!showAll); setResults([]); }}
            className={`text-[10px] px-2 py-1 rounded transition-colors ${showAll ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            {showAll ? 'Hide all codes' : 'Show all codes'}
          </button>
          {results.length > 0 && (
            <span className="text-[10px] text-[var(--text-muted)]">{results.length} result{results.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {selectedEntry && (
        <div className="p-2 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[var(--accent)] font-medium text-[10px]">{selectedEntry.code}</span>
            <span className="text-xs text-[var(--text-primary)] font-medium truncate">{selectedEntry.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleFHIRExport}
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)]/30 transition-colors"
            >
              <Copy size={10} />
              {fhirCopied ? 'Copied!' : 'FHIR Export'}
            </button>
            <button
              onClick={clearSelection}
              className="text-[10px] px-2 py-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto" aria-live="polite" aria-label={`${info.title} search results`}>
        {showAll && (
          <div className="p-2 space-y-1">
            {chapters.map((chapter) => {
              const chapterCodes = classificationType === 'icd11'
                ? getAllICD11Codes().filter((c) => c.chapter === chapter)
                : classificationType === 'icf'
                ? getAllICFCodes().filter((c) => c.chapter === chapter)
                : getAllICHICodes().filter((c) => c.chapter === chapter);

              const isExpanded = expandedChapters.has(chapter);
              return (
                <div key={chapter} className="rounded border border-[var(--border)] overflow-hidden">
                  <button
                    onClick={() => toggleChapter(chapter)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                    <span className="font-medium truncate">{chapter}</span>
                    <span className="ml-auto text-[10px] text-[var(--text-muted)]">{chapterCodes.length}</span>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[var(--border)]">
                      {chapterCodes.slice(0, visibleCounts[chapter] || PAGE_SIZE).map((entry: any) => (
                        <button
                          key={entry.code}
                          onClick={() => handleSelect(entry)}
                          className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--border)]/50 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[var(--accent)] font-medium">{entry.code}</span>
                            <span className="text-[var(--text-primary)]">{entry.title}</span>
                          </div>
                          <p className="text-[var(--text-muted)] mt-0.5 truncate">{entry.description}</p>
                        </button>
                      ))}
                      {(visibleCounts[chapter] || PAGE_SIZE) < chapterCodes.length && (
                        <button
                          onClick={() => showMoreCodes(chapter)}
                          className="w-full text-center px-3 py-1.5 text-[10px] text-[var(--accent)] hover:bg-[var(--bg-hover)] transition-colors"
                        >
                          Show {Math.min(PAGE_SIZE, chapterCodes.length - (visibleCounts[chapter] || PAGE_SIZE))} more ({chapterCodes.length - (visibleCounts[chapter] || PAGE_SIZE)} remaining)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {results.length > 0 && !showAll && (
          <div className="divide-y divide-[var(--border)]/50">
            {results.map((entry: any) => (
              <button
                key={entry.code}
                onClick={() => handleSelect(entry)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[var(--accent)] font-medium text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-subtler)]">{entry.code}</span>
                  <span className="text-[var(--text-primary)] font-medium">{entry.title}</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] truncate">{entry.chapter}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-2">{entry.description}</p>
              </button>
            ))}
          </div>
        )}

        {!showAll && results.length === 0 && query && (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-xs">
            <Search size={24} className="mb-2 opacity-30" />
            <p>No codes found for "{query}"</p>
          </div>
        )}

        {!showAll && results.length === 0 && !query && (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-xs px-4 text-center">
            <p className="mb-1">Search {CLASSIFICATION_LABELS[classificationType]} codes by entering a code, name, or {classificationType === 'icf' ? 'component' : 'chapter'}.</p>
            <p className="text-[10px] text-[var(--text-muted)]">Or click "Show all codes" to browse by {classificationType === 'icf' ? 'component' : 'chapter'}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export type { ClassificationType };

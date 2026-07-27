import React, { useState, useCallback } from 'react';
import type { ProviderConfig } from '../types';
import type { NLQueryResult } from '../services/nlQueryService';
import { Search, Loader2, MessageSquare, X } from './icons/lucide-shim';

interface Props {
  config: ProviderConfig;
  onSelectCode?: (code: string, type: 'icd11' | 'icf' | 'ichi') => void;
}

export const NLQueryPanel: React.FC<Props> = ({ config, onSelectCode }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<NLQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = useCallback(async () => {
    if (!query.trim() || !config.apiKey) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { naturalLanguageQuery } = await import('../services/nlQueryService');
      const res = await naturalLanguageQuery(query.trim(), config);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
    } finally {
      setLoading(false);
    }
  }, [query, config]);

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare size={14} className="text-[var(--accent)]" />
        <span className="text-xs font-medium">Natural Language Query</span>
      </div>
      <p className="text-[10px] text-[var(--text-muted)]">
        Ask about diseases, conditions, functioning, or interventions in plain English
      </p>
      <div className="flex gap-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          placeholder='e.g. "What is the code for hypertension?" or "ICD-11 codes for respiratory infections"'
          className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50"
          disabled={loading}
        />
        <button
          onClick={handleQuery}
          disabled={loading || !config.apiKey}
          className="px-3 py-1.5 bg-[var(--accent)] text-white text-xs rounded hover:bg-[var(--accent-dark)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
        </button>
      </div>
      {!config.apiKey && (
        <p className="text-[10px] text-yellow-400">Set an API key in Settings to use NLQ</p>
      )}

      {error && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">{error}</div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
              {result.classificationType.toUpperCase()} · {result.codes.length} code{result.codes.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {result.explanations.map((exp, i) => {
              const codeMatch = exp.match(/^([A-Z0-9.-]+):/);
              const code = codeMatch?.[1] || '';
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 rounded hover:bg-[var(--bg-hover)] text-xs cursor-pointer group"
                  onClick={() => code && onSelectCode?.(code, result.classificationType)}
                >
                  <Search size={10} className="text-[var(--accent)] mt-0.5 shrink-0 opacity-0 group-hover:opacity-100" />
                  <span className="text-[var(--text-secondary)]">{exp}</span>
                </div>
              );
            })}
          </div>
          {result.rawResponse && (
            <details className="text-[10px]">
              <summary className="text-[var(--text-muted)] cursor-pointer">Raw LLM response</summary>
              <pre className="mt-1 p-2 bg-[var(--bg-primary)] rounded text-[9px] overflow-x-auto">{result.rawResponse}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

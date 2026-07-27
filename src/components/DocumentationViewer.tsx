import React, { useState, useEffect, useMemo, useRef } from 'react';
import { parse } from '@/utils/markdown';

type DocsEntry = { title: string; category: string };

const DOCS_MAP: Record<string, DocsEntry> = {
  'index': { title: 'Documentation Home', category: 'Home' },
  'project/000-overview': { title: 'Project Overview', category: 'Project' },
  'project/001-concept': { title: 'Concept & Vision', category: 'Project' },
  'project/002-specification': { title: 'Technical Specification', category: 'Project' },
  'project/003-blueprint': { title: 'Project Blueprint', category: 'Project' },
  'project/004-architecture': { title: 'System Architecture', category: 'Project' },
  'project/005-design': { title: 'UI/UX Design System', category: 'Project' },
  'architecture/000-index': { title: 'ADR Overview', category: 'Architecture' },
  'architecture/001-zero-npm-dependency': { title: 'ADR-001: Zero NPM Dependency', category: 'Architecture' },
  'architecture/002-6-tier-memory': { title: 'ADR-002: 6-Tier Memory', category: 'Architecture' },
  'architecture/003-vector-web-worker': { title: 'ADR-003: Vector Web Worker', category: 'Architecture' },
  'architecture/004-code-splitting': { title: 'ADR-004: Code Splitting', category: 'Architecture' },
  'architecture/005-indexeddb-schema': { title: 'ADR-005: IndexedDB Schema', category: 'Architecture' },
  'architecture/006-pwa-offline': { title: 'ADR-006: PWA & Offline', category: 'Architecture' },
  'developers/000-quickstart': { title: '5-Minute Quick Start', category: 'Developers' },
  'developers/001-setup': { title: 'Complete Setup & Installation', category: 'Developers' },
  'developers/002-environment': { title: 'Environment Variables & API Keys', category: 'Developers' },
  'developers/003-non-coder-guide': { title: 'Guide for Non-Coder Developers', category: 'Developers' },
  'developers/004-development': { title: 'Development Guidelines', category: 'Developers' },
  'developers/005-memory-architecture': { title: 'Memory Architecture Deep Dive', category: 'Developers' },
  'developers/006-test-suite': { title: 'Test Suite Documentation', category: 'Developers' },
  'developers/007-code-splitting': { title: 'Code Splitting & Performance', category: 'Developers' },
  'developers/008-ci-cd': { title: 'CI/CD Pipeline', category: 'Developers' },
  'developers/009-deployment': { title: 'Deployment Guide', category: 'Developers' },
  'developers/010-dependency-removal': { title: 'Zero-Dependency Architecture', category: 'Developers' },
  'developers/011-mcp-configuration': { title: 'MCP Server Configuration', category: 'Developers' },
  'guides/000-getting-started': { title: 'Getting Started', category: 'Guides' },
  'guides/001-agents': { title: 'A2A Agents Guide', category: 'Guides' },
  'guides/002-workflows': { title: 'Multi-Agent Workflows', category: 'Guides' },
  'guides/003-diagrams': { title: 'Diagram Generation', category: 'Guides' },
  'guides/004-pdf-export': { title: 'PDF Export Guide', category: 'Guides' },
  'guides/005-sandbox': { title: 'Sandboxed Code Execution', category: 'Guides' },
  'guides/006-epi-map': { title: 'Epidemiological Map', category: 'Guides' },
  'guides/007-icd11': { title: 'ICD-11 Lookup', category: 'Guides' },
  'guides/008-connectors': { title: 'Connectors Guide', category: 'Guides' },
  'guides/009-webhooks': { title: 'Webhooks Guide', category: 'Guides' },
  'guides/010-public-data': { title: 'Public Data APIs', category: 'Guides' },
  'api/000-index': { title: 'API Documentation', category: 'API' },
  'api/001-memory-api': { title: 'Memory API Reference', category: 'API' },
  'api/002-indexeddb': { title: 'IndexedDB Schema', category: 'API' },
  'api/003-gemini-service': { title: 'Gemini/LLM Service API', category: 'API' },
  'api/004-sandbox-api': { title: 'Sandbox API Reference', category: 'API' },
  'agents/SKILL': { title: 'A2A Debate Agents Overview', category: 'Agents' },
  'agents/references/index': { title: 'Agent System Reference', category: 'Agents' },
  'agents/coordinator/SKILL': { title: 'Coordinator Agent', category: 'Agents' },
  'agents/coordinator/references/TEMPLATES': { title: 'Coordinator — Templates', category: 'Agents' },
  'agents/coordinator/references/TOOLS': { title: 'Coordinator — Tools', category: 'Agents' },
  'agents/coordinator/workflows/README': { title: 'Coordinator — Workflows', category: 'Agents' },
  'agents/data-analyst/SKILL': { title: 'Data Analyst Agent', category: 'Agents' },
  'agents/data-analyst/references/TEMPLATES': { title: 'Data Analyst — Templates', category: 'Agents' },
  'agents/data-analyst/references/TOOLS': { title: 'Data Analyst — Tools', category: 'Agents' },
  'agents/data-analyst/workflows/README': { title: 'Data Analyst — Workflows', category: 'Agents' },
  'agents/librarian/SKILL': { title: 'Librarian Agent', category: 'Agents' },
  'agents/librarian/references/TEMPLATES': { title: 'Librarian — Templates', category: 'Agents' },
  'agents/librarian/references/TOOLS': { title: 'Librarian — Tools', category: 'Agents' },
  'agents/librarian/workflows/README': { title: 'Librarian — Workflows', category: 'Agents' },
  'agents/researcher/SKILL': { title: 'Researcher Agent', category: 'Agents' },
  'agents/researcher/references/TEMPLATES': { title: 'Researcher — Templates', category: 'Agents' },
  'agents/researcher/references/TOOLS': { title: 'Researcher — Tools', category: 'Agents' },
  'agents/researcher/workflows/README': { title: 'Researcher — Workflows', category: 'Agents' },
  'agents/reviewer/SKILL': { title: 'Reviewer Agent', category: 'Agents' },
  'agents/reviewer/references/TEMPLATES': { title: 'Reviewer — Templates', category: 'Agents' },
  'agents/reviewer/references/TOOLS': { title: 'Reviewer — Tools', category: 'Agents' },
  'agents/reviewer/workflows/README': { title: 'Reviewer — Workflows', category: 'Agents' },
  'agents/writer/SKILL': { title: 'Writer Agent', category: 'Agents' },
  'agents/writer/references/TEMPLATES': { title: 'Writer — Templates', category: 'Agents' },
  'agents/writer/references/TOOLS': { title: 'Writer — Tools', category: 'Agents' },
  'agents/writer/workflows/README': { title: 'Writer — Workflows', category: 'Agents' },
  'benchmarks/000-index': { title: 'Benchmarks Overview', category: 'Benchmarks' },
  'benchmarks/001-results': { title: 'Benchmark Results', category: 'Benchmarks' },
  'changelog/000-changelog': { title: 'Changelog', category: 'Changelog' },
  'a11y/000-a11y': { title: 'Accessibility', category: 'A11y' },
  'i18n/000-i18n': { title: 'Internationalization', category: 'i18n' },
  'ops/000-docs-ci-cd': { title: 'Docs Publishing Pipeline', category: 'Ops' },
  'ops/001-docs-style-guide': { title: 'Documentation Style Guide', category: 'Ops' },
  'security/000-index': { title: 'Security Documentation', category: 'Security' },
  'security/001-threat-model': { title: 'Threat Model', category: 'Security' },
  'security/002-data-privacy': { title: 'Data Privacy & Trust', category: 'Security' },
  'security/003-api-key-management': { title: 'API Key Management', category: 'Security' },
};

const CATEGORIES = [
  'Project', 'Architecture', 'Developers', 'Guides', 'API',
  'Agents', 'Benchmarks', 'Changelog', 'Security', 'Ops',
  'A11y', 'i18n',
];

const SEARCH_INDEX = Object.entries(DOCS_MAP).map(([id, doc]) => ({
  id,
  title: doc.title.toLowerCase(),
  category: doc.category.toLowerCase(),
  searchText: `${doc.title} ${doc.category}`.toLowerCase(),
}));

interface DocSection {
  id: string;
  title: string;
  content: string;
}

function parseMarkdownSections(markdown: string): DocSection[] {
  const lines = markdown.split('\n');
  const sections: DocSection[] = [];
  let currentSection: DocSection | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^#{2,4}\s+(.+)/);
    if (headingMatch) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        id: headingMatch[1].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title: headingMatch[1],
        content: '',
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }
  if (currentSection) sections.push(currentSection);
  return sections;
}

export const DocumentationViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<string>('index');
  const [searchQuery, setSearchQuery] = useState('');
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const doc = DOCS_MAP[activeDoc] || DOCS_MAP['index'];

  useEffect(() => {
    if (!doc) return;
    setLoading(true);
    const basePath = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
    const url = `${basePath}docs/${activeDoc === 'index' ? 'index' : activeDoc}.md`;
    fetch(url)
      .then((r) => r.ok ? r.text() : '# Document not found')
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(() => {
        setMarkdown('# Document not available\n\nThe documentation content could not be loaded.');
        setLoading(false);
      });
  }, [activeDoc]);

  // Post-render: KaTeX and Mermaid
  useEffect(() => {
    if (!contentRef.current || loading) return;

    // KaTeX
    const katex = (window as any).katex;
    if (katex) {
      contentRef.current.querySelectorAll('.katex-math').forEach((el) => {
        const math = el.getAttribute('data-math');
        if (math) {
          try { katex.render(math, el, { displayMode: true, throwOnError: false }); } catch {}
        }
      });
      contentRef.current.querySelectorAll('.katex-inline').forEach((el) => {
        const math = el.getAttribute('data-math');
        if (math) {
          try { katex.render(math, el, { displayMode: false, throwOnError: false }); } catch {}
        }
      });
    }

    // Mermaid
    const mermaidBlocks = contentRef.current.querySelectorAll('.language-mermaid');
    if (mermaidBlocks.length > 0 && (window as any).mermaid) {
      mermaidBlocks.forEach((el) => {
        const pre = el.closest('pre');
        if (pre) {
          const source = el.textContent || '';
          const div = document.createElement('div');
          div.className = 'mermaid';
          div.textContent = source;
          pre.parentNode?.replaceChild(div, pre);
        }
      });
      try {
        (window as any).mermaid.run({ querySelector: '.mermaid' });
      } catch {}
    }
  }, [markdown, loading]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return SEARCH_INDEX
      .filter((item) => item.searchText.includes(q) || item.title.includes(q))
      .map((item) => ({ id: item.id, ...DOCS_MAP[item.id] }))
      .slice(0, 10);
  }, [searchQuery]);

  const sections = useMemo(() => parseMarkdownSections(markdown), [markdown]);

  return (
    <div className="flex h-full bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
      <aside className="w-64 border-r border-[var(--border)] overflow-y-auto shrink-0 bg-[var(--bg-secondary)]">
        <div className="p-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          {filteredDocs ? (
            <div className="space-y-0.5">
              {filteredDocs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setActiveDoc(d.id); setSearchQuery(''); }}
                  className="w-full text-left text-xs px-2 py-1 rounded hover:bg-[var(--accent-subtle)] text-[var(--accent)]"
                >
                  {d.title}
                </button>
              ))}
            </div>
          ) : (
            CATEGORIES.map((cat) => {
              const entries = Object.entries(DOCS_MAP).filter(([, d]) => d.category === cat);
              if (entries.length === 0) return null;
              return (
                <div key={cat} className="mb-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 mb-1">{cat}</div>
                  {entries.map(([id, d]) => (
                    <button
                      key={id}
                      onClick={() => setActiveDoc(id)}
                      className={`w-full text-left text-xs px-2 py-1 rounded transition-colors ${
                        activeDoc === id ? 'bg-[var(--accent-subtle)] text-[var(--accent-light)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      {d.title}
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {doc && (
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">{doc.category}</span>
              <span className="text-xs text-[var(--text-muted)]">/</span>
              <h1 className="text-sm font-semibold text-[var(--text-primary)]">{doc.title}</h1>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]" />
            </div>
          ) : (
            <div className="space-y-2">
              <div
                ref={contentRef}
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: parse(markdown) }}
              />

              {sections.length > 1 && (
                <div className="mt-8 pt-5 border-t border-[var(--border)]">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">On this page</div>
                  <div className="flex flex-wrap gap-1.5">
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          const el = document.getElementById(s.id);
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-xs px-2.5 py-1 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors"
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

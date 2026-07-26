import React, { useState, useEffect, useMemo } from 'react';

const DOCS_MAP: Record<string, { title: string; category: string; path: string }> = {
  'index': { title: 'Documentation Home', category: 'home', path: '/docs/index.md' },
  'project/000-overview': { title: 'Project Overview', category: 'Project', path: '/docs/project/000-overview.md' },
  'project/010-blueprint': { title: 'Blueprint', category: 'Project', path: '/docs/project/010-blueprint.md' },
  'project/020-architecture': { title: 'Architecture', category: 'Project', path: '/docs/project/020-architecture.md' },
  'project/030-design': { title: 'UI/UX Design', category: 'Project', path: '/docs/project/030-design.md' },
  'project/090-feature-status': { title: 'Feature Status', category: 'Project', path: '/docs/project/090-feature-status.md' },
  'project/100-reference': { title: 'Reference', category: 'Project', path: '/docs/project/100-reference.md' },
  'project/110-repository-tree': { title: 'Repository Tree', category: 'Project', path: '/docs/project/110-repository-tree.md' },
  'developers/040-development': { title: 'Development Guide', category: 'Developers', path: '/docs/developers/040-development.md' },
  'developers/050-setup': { title: 'Setup Guide', category: 'Developers', path: '/docs/developers/050-setup.md' },
  'developers/070-memory-architecture': { title: 'Memory Architecture', category: 'Developers', path: '/docs/developers/070-memory-architecture.md' },
  'developers/080-test-suite': { title: 'Test Suite', category: 'Developers', path: '/docs/developers/080-test-suite.md' },
  'developers/095-code-splitting': { title: 'Code Splitting', category: 'Developers', path: '/docs/developers/095-code-splitting.md' },
  'developers/098-cicd-pipeline': { title: 'CI/CD Pipeline', category: 'Developers', path: '/docs/developers/098-cicd-pipeline.md' },
  'developers/099-deployment': { title: 'Deployment', category: 'Developers', path: '/docs/developers/099-deployment.md' },
  'guides/060-agents': { title: 'A2A Agents Guide', category: 'Guides', path: '/docs/guides/060-agents.md' },
  'guides/091-workflows': { title: 'Multi-Agent Workflows', category: 'Guides', path: '/docs/guides/091-workflows.md' },
  'guides/092-diagrams': { title: 'Diagram Generation', category: 'Guides', path: '/docs/guides/092-diagrams.md' },
  'guides/093-pdf-export': { title: 'PDF Export', category: 'Guides', path: '/docs/guides/093-pdf-export.md' },
  'guides/094-sandbox': { title: 'Sandboxed Execution', category: 'Guides', path: '/docs/guides/094-sandbox.md' },
  'guides/096-epi-map': { title: 'Epi Map', category: 'Guides', path: '/docs/guides/096-epi-map.md' },
  'guides/097-icd11': { title: 'ICD-11 Lookup', category: 'Guides', path: '/docs/guides/097-icd11.md' },
  'agents/index': { title: 'Agent Documentation Index', category: 'Agents', path: '/docs/agents/index.md' },
  'agents/researcher': { title: 'Researcher Agent', category: 'Agents', path: '/docs/agents/researcher/index.md' },
  'agents/data-analyst': { title: 'Data Analyst Agent', category: 'Agents', path: '/docs/agents/data-analyst/index.md' },
  'agents/writer': { title: 'Writer Agent', category: 'Agents', path: '/docs/agents/writer/index.md' },
  'agents/reviewer': { title: 'Reviewer Agent', category: 'Agents', path: '/docs/agents/reviewer/index.md' },
  'agents/librarian': { title: 'Librarian Agent', category: 'Agents', path: '/docs/agents/librarian/index.md' },
  'agents/coordinator': { title: 'Coordinator Agent', category: 'Agents', path: '/docs/agents/coordinator/index.md' },
};

const CATEGORIES = ['Project', 'Developers', 'Guides', 'Agents'] as const;

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

function renderMarkdownToHtml(markdown: string): string {
  let html = markdown
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-4 mb-1 text-[var(--text-primary)]">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold mt-5 mb-2 text-[var(--accent-light)]">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-2 mb-3 text-white">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="text-[var(--text-secondary)]">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="text-[10px] px-1 py-0.5 rounded bg-[var(--accent-dark)]/50 text-[var(--accent-light)]">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="text-[11px] text-[var(--text-secondary)] ml-3 list-disc">$1</li>')
    .replace(/^\| (.+) \|$/gm, (match: string) => {
      const cells = match.split('|').filter(Boolean).map((c: string) => c.trim());
      if (cells.every((c: string) => /^[-:]+$/.test(c))) return '<tr class="border-b border-[var(--border)]"><td colspan="99"><hr class="border-[var(--border)]" /></td></tr>';
      return `<tr class="border-b border-[var(--border)]">${cells.map((c: string) => `<td class="text-[10px] px-2 py-1 text-[var(--text-secondary)]">${c}</td>`).join('')}</tr>`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--accent)] hover:text-[var(--accent-light)] underline" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, '</p><p class="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2">')
    .replace(/^---$/gm, '<hr class="border-[var(--border)] my-3" />');

  html = '<p class="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2">' + html + '</p>';
  html = html.replace(/<\/p>\s*<p class="text-\[11px\] text-\[var\(--text-secondary\)\] leading-relaxed mb-2">\s*<\/p>/g, '</p><p class="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2"></p>');
  return html;
}

export const DocumentationViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<string>('index');
  const [searchQuery, setSearchQuery] = useState('');
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const doc = DOCS_MAP[activeDoc];

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
        setMarkdown('# Document not available\n\nThe documentation content could not be loaded. Please refer to the `docs/` folder in the repository.');
        setLoading(false);
      });
  }, [activeDoc]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return SEARCH_INDEX
      .filter((item) => item.searchText.includes(q) || item.title.includes(q))
      .map((item) => DOCS_MAP[item.id])
      .slice(0, 10);
  }, [searchQuery]);

  const sections = useMemo(() => parseMarkdownSections(markdown), [markdown]);

  return (
    <div className="flex h-full bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
      <aside className="w-56 border-r border-[var(--border)] overflow-y-auto shrink-0 bg-[var(--bg-secondary)]">
        <div className="p-2">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-[10px] px-2 py-1.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-600 focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          {filteredDocs ? (
            <div className="space-y-0.5">
              {filteredDocs.map((d) => (
                <button
                  key={d.path}
                  onClick={() => { setActiveDoc(d.path.replace('/docs/', '').replace('.md', '')); setSearchQuery(''); }}
                  className="w-full text-left text-[10px] px-2 py-1 rounded hover:bg-[var(--accent-subtle)] text-[var(--accent)]"
                >
                  {d.title}
                </button>
              ))}
            </div>
          ) : (
            CATEGORIES.map((cat) => (
              <div key={cat} className="mb-2">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 mb-1">{cat}</div>
                {Object.entries(DOCS_MAP)
                  .filter(([, d]) => d.category === cat)
                  .map(([id, d]) => (
                    <button
                      key={id}
                      onClick={() => setActiveDoc(id)}
                      className={`w-full text-left text-[10px] px-2 py-1 rounded transition-colors ${
                        activeDoc === id ? 'bg-[var(--accent-subtle)] text-[var(--accent-light)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      {d.title}
                    </button>
                  ))}
              </div>
            ))
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border)]">
            <span className="text-[9px] font-medium uppercase tracking-wider text-[var(--accent)]">{doc?.category || ''}</span>
            <span className="text-[10px] text-[var(--text-muted)]">/</span>
            <h1 className="text-xs font-semibold text-[var(--text-primary)]">{doc?.title || 'Documentation'}</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent)]" />
            </div>
          ) : (
            <div className="space-y-1">
              <div
                className="prose prose-invert max-w-none [&_pre]:bg-[var(--bg-secondary)] [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-[10px] [&_pre]:overflow-x-auto [&_code]:text-[10px]"
                dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(markdown) }}
              />

              {sections.length > 1 && (
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Sections</div>
                  <div className="flex flex-wrap gap-1">
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          const el = document.getElementById(s.id);
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[9px] px-2 py-1 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors"
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
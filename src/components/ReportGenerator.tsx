import React, { useState, useCallback } from 'react';
import type { EpiDataPoint } from './EpiMap';
import type { SurveillanceSummary } from '../services/surveillanceService';
import type { OutbreakAlert, OutbreakStats } from '../services/outbreakService';
import type { ReportTemplate, ReportData } from '../services/reportService';
import { FileText, Download, Copy, Loader2, ChevronDown, ChevronRight } from './icons/lucide-shim';

interface Props {
  surveillanceData: EpiDataPoint[];
  summary: SurveillanceSummary | null;
  alerts: OutbreakAlert[];
  stats: OutbreakStats | null;
  selectedCodes?: string[];
}

export const ReportGenerator: React.FC<Props> = ({ surveillanceData, summary, alerts, stats, selectedCodes }) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadTemplates = useCallback(async () => {
    if (templates.length > 0) return;
    const { getReportTemplates } = await import('../services/reportService');
    setTemplates(getReportTemplates());
  }, [templates.length]);

  const handleGenerate = useCallback(async () => {
    if (!selectedTemplate) return;
    setLoading(true);
    try {
      const { generateReport } = await import('../services/reportService');
      const result = generateReport(selectedTemplate, surveillanceData, summary ?? undefined, alerts ?? [], stats ?? undefined, selectedCodes);
      setReport(result);
      setShowPreview(true);
    } catch (err) {
      console.error('Report generation failed:', err);
    }
    setLoading(false);
  }, [selectedTemplate, surveillanceData, summary, alerts, stats, selectedCodes]);

  const handleExport = useCallback(async () => {
    if (!report) return;
    const { renderReportToMarkdown } = await import('../services/reportService');
    const md = renderReportToMarkdown(report);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [report]);

  const handleCopy = useCallback(async () => {
    if (!report) return;
    const { renderReportToMarkdown } = await import('../services/reportService');
    const md = renderReportToMarkdown(report);
    await navigator.clipboard.writeText(md);
  }, [report]);

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setExpanded(!expanded); loadTemplates(); }}>
        {expanded ? <ChevronDown size={14} className="text-[var(--text-muted)]" /> : <ChevronRight size={14} className="text-[var(--text-muted)]" />}
        <FileText size={14} className="text-[var(--accent)]" />
        <span className="text-xs font-medium">Report Generator</span>
      </div>

      {expanded && (
        <div className="space-y-3 pl-4">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-xs focus:outline-none"
          >
            <option value="">Select template...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name} — {t.category}</option>
            ))}
          </select>

          {selectedTemplate && (
            <div className="text-[10px] text-[var(--text-muted)]">
              {templates.find((t) => t.id === selectedTemplate)?.description}
            </div>
          )}

          <div className="flex gap-1">
            <button
              onClick={handleGenerate}
              disabled={!selectedTemplate || loading}
              className="px-3 py-1.5 bg-[var(--accent)] text-white text-xs rounded hover:bg-[var(--accent-dark)] disabled:opacity-50"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : 'Generate'}
            </button>
            {report && (
              <>
                <button onClick={handleExport} className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]" title="Download as Markdown"><Download size={14} /></button>
                <button onClick={handleCopy} className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]" title="Copy to clipboard"><Copy size={14} /></button>
              </>
            )}
          </div>

          {showPreview && report && (
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded p-3 max-h-80 overflow-y-auto">
              <div className="text-xs font-medium mb-2">{report.title}</div>
              <div className="text-[10px] text-[var(--text-muted)] mb-2">Generated: {new Date(report.generatedAt).toLocaleString()}</div>
              {report.sections.map((section, i) => (
                <div key={i} className="mb-2">
                  <div className="text-[11px] font-medium text-[var(--accent)] mb-1">{section.title}</div>
                  <div className={`text-[10px] text-[var(--text-secondary)] whitespace-pre-wrap ${section.type === 'list' ? 'list' : ''}`}>{section.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

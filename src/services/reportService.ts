import { getICD11ByCode } from './icd11Service';
import type { EpiDataPoint } from '../components/EpiMap';
import type { SurveillanceSummary } from './surveillanceService';
import type { OutbreakAlert, OutbreakStats } from './outbreakService';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'surveillance' | 'clinical' | 'epidemiological' | 'administrative';
  format: 'markdown' | 'html';
  template: string;
}

export interface ReportData {
  title: string;
  generatedAt: string;
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  content: string;
  type: 'text' | 'table' | 'list' | 'alert';
}

const TEMPLATES: ReportTemplate[] = [
  {
    id: 'outbreak-summary',
    name: 'Outbreak Summary Report',
    description: 'Overview of current outbreak alerts and surveillance data',
    category: 'epidemiological',
    format: 'markdown',
    template: '# Outbreak Summary Report\n\nGenerated: {{date}}\n\n## Overview\n- Total Alerts: {{totalAlerts}}\n- Critical: {{criticalAlerts}}\n- High: {{highAlerts}}\n- Trend: {{trend}}\n\n## Active Alerts\n\n{{alerts}}\n\n## Top Diseases\n\n{{topDiseases}}\n\n## Recommendations\n\n{{recommendations}}',
  },
  {
    id: 'surveillance-snapshot',
    name: 'Surveillance Snapshot',
    description: 'Current surveillance statistics across all feeds',
    category: 'surveillance',
    format: 'markdown',
    template: '# Surveillance Snapshot\n\nDate: {{date}}\n\n## Key Metrics\n- Total Cases: {{totalCases}}\n- Diseases Tracked: {{diseasesTracked}}\n- Regions Monitored: {{regionsMonitored}}\n- Active Outbreaks: {{activeOutbreaks}}\n\n## Disease Breakdown\n\n{{diseaseBreakdown}}',
  },
  {
    id: 'clinical-codes',
    name: 'ICD-11 Clinical Code Reference',
    description: 'Selected ICD-11 codes for clinical documentation',
    category: 'clinical',
    format: 'markdown',
    template: '# ICD-11 Clinical Code Reference\n\nGenerated: {{date}}\n\n{{codes}}',
  },
];

export function getReportTemplates(): ReportTemplate[] {
  return [...TEMPLATES];
}

export function generateReport(
  templateId: string,
  surveillanceData?: EpiDataPoint[],
  summary?: SurveillanceSummary,
  alerts?: OutbreakAlert[],
  stats?: OutbreakStats,
  selectedCodes?: string[],
): ReportData {
  const safeAlerts = alerts || [];
  const template = TEMPLATES.find((t) => t.id === templateId);
  if (!template) throw new Error(`Template not found: ${templateId}`);

  const sections: ReportSection[] = [];
  const now = new Date().toISOString();

  if (templateId === 'outbreak-summary' && stats) {
    const alertsMd = safeAlerts.slice(0, 10).map((a) =>
      `- **${a.disease}** at ${a.location}: ${a.cases} cases (${a.severity}, anomaly ${a.anomalyScore}x, ${a.trend})`
    ).join('\n');

    const topMd = (stats?.topDiseases || []).map((d) =>
      `- ${d.disease}: ${d.cases} cases`
    ).join('\n');

    const recsMd = safeAlerts.slice(0, 3).map((a) =>
      `- ${a.disease} (${a.location}): ${a.recommendation}`
    ).join('\n');

    if (stats) {
      sections.push({
        title: 'Overview',
        content: `Total Alerts: ${stats.totalAlerts} | Critical: ${stats.criticalAlerts} | High: ${stats.highAlerts} | Trend: ${stats.trend}`,
        type: 'text',
      });
    }
    sections.push({ title: 'Active Alerts', content: alertsMd || 'None', type: 'list' });
    sections.push({ title: 'Top Diseases', content: topMd || 'None', type: 'list' });
    sections.push({ title: 'Recommendations', content: recsMd || 'Standard surveillance vigilance.', type: 'text' });
  }

  if (templateId === 'surveillance-snapshot' && summary) {
    const diseaseMd = Object.entries(summary.byDisease)
      .map(([disease, info]) => `- ${disease}: ${info.cases} cases (${info.count} reports, ${info.severity})`)
      .join('\n');

    sections.push({
      title: 'Key Metrics',
      content: `Total Cases: ${summary.totalCases}\nDiseases Tracked: ${summary.diseasesTracked}\nRegions: ${summary.regionsMonitored}\nActive: ${summary.activeOutbreaks}`,
      type: 'text',
    });
    sections.push({ title: 'Disease Breakdown', content: diseaseMd || 'None', type: 'list' });
  }

  if (templateId === 'clinical-codes' && selectedCodes) {
    const codesMd = selectedCodes.map((code) => {
      const entry = getICD11ByCode(code);
      return entry ? `- **${entry.code}**: ${entry.title} — ${entry.description}` : `- ${code}: not found in local dataset`;
    }).join('\n');
    sections.push({ title: 'Codes', content: codesMd || 'No codes selected', type: 'list' });
  }

  return {
    title: template.name,
    generatedAt: now,
    sections,
  };
}

export function renderReportToMarkdown(report: ReportData): string {
  const lines: string[] = [];
  lines.push(`# ${report.title}`);
  lines.push(`\n_Generated: ${new Date(report.generatedAt).toLocaleString()}_\n`);
  for (const section of report.sections) {
    lines.push(`\n## ${section.title}\n`);
    if (section.type === 'list') {
      lines.push(section.content);
    } else if (section.type === 'table') {
      lines.push(section.content);
    } else {
      lines.push(section.content);
    }
  }
  return lines.join('\n');
}

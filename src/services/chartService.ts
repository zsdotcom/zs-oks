export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  title?: string;
  labels: string[];
  datasets: { label: string; values: number[]; color?: string }[];
  width?: number;
  height?: number;
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderBars(cfg: ChartConfig): string {
  const w = cfg.width || 600;
  const h = cfg.height || 300;
  const pad = { top: 30, right: 20, bottom: 60, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const allValues = cfg.datasets.flatMap((d) => d.values);
  const maxVal = Math.max(...allValues, 1);
  const groupW = chartW / cfg.labels.length;
  const barW = Math.max(4, (groupW - 4) / cfg.datasets.length);

  let bars = '';
  let axes = '';

  cfg.labels.forEach((label, i) => {
    cfg.datasets.forEach((ds, j) => {
      const x = pad.left + i * groupW + 2 + j * barW;
      const barH = (ds.values[i] / maxVal) * chartH;
      const y = pad.top + chartH - barH;
      const color = ds.color || COLORS[j % COLORS.length];
      bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${color}" opacity="0.85" rx="2">
        <title>${escapeXml(ds.label)}: ${ds.values[i]}</title>
      </rect>`;
    });
    axes += `<text x="${pad.left + i * groupW + groupW / 2}" y="${h - pad.bottom + 16}" text-anchor="middle" font-size="11" fill="#666">${escapeXml(label)}</text>`;
  });

  const lines = cfg.datasets.map(() => '').join('');
  const gridLines = '';
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    const val = Math.round((maxVal / 4) * (4 - i));
    axes += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#999">${val}</text>`;
    axes += `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="#e5e7eb" stroke-width="1" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${cfg.title ? `<text x="${w / 2}" y="16" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${escapeXml(cfg.title)}</text>` : ''}
    ${axes}${bars}
  </svg>`;
}

function renderLine(cfg: ChartConfig): string {
  const w = cfg.width || 600;
  const h = cfg.height || 300;
  const pad = { top: 30, right: 20, bottom: 60, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const allValues = cfg.datasets.flatMap((d) => d.values);
  const maxVal = Math.max(...allValues, 1);
  const stepX = chartW / Math.max(cfg.labels.length - 1, 1);

  let paths = '';
  let axes = '';

  cfg.labels.forEach((label, i) => {
    axes += `<text x="${pad.left + i * stepX}" y="${h - pad.bottom + 16}" text-anchor="middle" font-size="11" fill="#666">${escapeXml(label)}</text>`;
  });

  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    const val = Math.round((maxVal / 4) * (4 - i));
    axes += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#999">${val}</text>`;
    axes += `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="#e5e7eb" stroke-width="1" />`;
  }

  cfg.datasets.forEach((ds, di) => {
    const color = ds.color || COLORS[di % COLORS.length];
    const points = ds.values.map((v, i) => {
      const x = pad.left + i * stepX;
      const y = pad.top + chartH - (v / maxVal) * chartH;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    paths += `<path d="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" />`;
    ds.values.forEach((v, i) => {
      const x = pad.left + i * stepX;
      const y = pad.top + chartH - (v / maxVal) * chartH;
      paths += `<circle cx="${x}" cy="${y}" r="3.5" fill="${color}" stroke="white" stroke-width="1.5">
        <title>${escapeXml(ds.label)}: ${v}</title>
      </circle>`;
    });
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${cfg.title ? `<text x="${w / 2}" y="16" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${escapeXml(cfg.title)}</text>` : ''}
    ${axes}${paths}
  </svg>`;
}

function renderPie(cfg: ChartConfig): string {
  const w = cfg.width || 400;
  const h = cfg.height || 300;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 40;
  const total = cfg.datasets[0]?.values.reduce((a, b) => a + b, 0) || 1;
  let cumulativeAngle = -Math.PI / 2;
  let slices = '';
  let legend = '';

  cfg.datasets[0]?.values.forEach((val, i) => {
    const sliceAngle = (val / total) * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const color = COLORS[i % COLORS.length];
    const label = cfg.labels[i] || `Slice ${i + 1}`;
    slices += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z" fill="${color}" stroke="white" stroke-width="2">
      <title>${escapeXml(label)}: ${val} (${Math.round((val / total) * 100)}%)</title>
    </path>`;
    const midAngle = startAngle + sliceAngle / 2;
    const lx = cx + (r * 0.6) * Math.cos(midAngle);
    const ly = cy + (r * 0.6) * Math.sin(midAngle);
    if (sliceAngle > 0.2) {
      slices += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="white" font-weight="bold">${Math.round((val / total) * 100)}%</text>`;
    }
    cumulativeAngle += sliceAngle;
    legend += `<div style="display:flex;align-items:center;gap:4px;font-size:11px;margin:2px 0"><span style="width:10px;height:10px;background:${color};border-radius:2px;display:inline-block"></span>${escapeXml(label)}: ${val}</div>`;
  });

  return `<div style="display:flex;align-items:center;gap:16px">
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      ${cfg.title ? `<text x="${cx}" y="16" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${escapeXml(cfg.title)}</text>` : ''}
      ${slices}
    </svg>
    <div style="flex-shrink:0">${legend}</div>
  </div>`;
}

export function renderChart(cfg: ChartConfig): string {
  switch (cfg.type) {
    case 'bar': return renderBars(cfg);
    case 'line': return renderLine(cfg);
    case 'pie': return renderPie(cfg);
    case 'scatter': return renderLine({ ...cfg, type: 'line' });
    default: return renderBars(cfg);
  }
}

export function renderMermaidDiagram(code: string): string {
  const escaped = escapeXml(code);
  return `<div class="mermaid">${escaped}</div>`;
}

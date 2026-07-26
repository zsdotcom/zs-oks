/**
 * Zero-dependency SVG charting components.
 * Bar chart, line chart, and area chart — all pure SVG, no library.
 * @license SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface LineChartData {
  label: string;
  values: { x: string; y: number }[];
  color?: string;
}

/* ─── Bar Chart ─── */
export const BarChart: React.FC<{
  data: BarChartData[];
  width?: number;
  height?: number;
  barColor?: string;
  title?: string;
}> = ({ data, width = 400, height = 250, barColor = '#4f46e5', title }) => {
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barW = Math.min(40, (chartW / data.length) * 0.7);
  const gap = chartW / data.length;

  return (
    <svg width={width} height={height} className="w-full h-auto">
      {title && <text x={width / 2} y={18} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">{title}</text>}
      {/* Y-axis grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = padding.top + chartH * (1 - pct);
        const val = Math.round(maxVal * pct);
        return (
          <g key={pct}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#3a3a3a" strokeWidth="0.5" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#888" fontSize="10">{val}</text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const x = padding.left + i * gap + (gap - barW) / 2;
        const barH = (d.value / maxVal) * chartH;
        const y = padding.top + chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill={d.color || barColor} opacity="0.85" />
            <text x={x + barW / 2} y={height - padding.bottom + 16} textAnchor="middle" fill="#888" fontSize="9">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ─── Line Chart ─── */
export const LineChart: React.FC<{
  data: LineChartData[];
  width?: number;
  height?: number;
  title?: string;
}> = ({ data, width = 400, height = 250, title }) => {
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  if (data.length === 0 || data[0].values.length === 0) {
    return <svg width={width} height={height}><text x={width / 2} y={height / 2} textAnchor="middle" fill="#666" fontSize="13">No data</text></svg>;
  }

  const allValues = data.flatMap((d) => d.values.map((v) => v.y));
  const maxVal = Math.max(...allValues, 1);
  const labels = data[0].values.map((v) => v.x);
  const step = chartW / Math.max(labels.length - 1, 1);

  return (
    <svg width={width} height={height} className="w-full h-auto">
      {title && <text x={width / 2} y={18} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">{title}</text>}
      {/* Y-axis */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = padding.top + chartH * (1 - pct);
        const val = Math.round(maxVal * pct);
        return (
          <g key={pct}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#3a3a3a" strokeWidth="0.5" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#888" fontSize="10">{val}</text>
          </g>
        );
      })}
      {/* X-axis labels */}
      {labels.map((label, i) => (
        <text key={i} x={padding.left + i * step} y={height - padding.bottom + 16} textAnchor="middle" fill="#888" fontSize="9">{label}</text>
      ))}
      {/* Lines */}
      {data.map((series, si) => {
        const color = series.color || `hsl(${(si * 120) % 360}, 70%, 60%)`;
        const points = series.values.map((v, i) => {
          const x = padding.left + i * step;
          const y = padding.top + chartH * (1 - v.y / maxVal);
          return `${x},${y}`;
        }).join(' ');
        const areaPoints = `${padding.left},${padding.top + chartH} ${points} ${padding.left + (series.values.length - 1) * step},${padding.top + chartH}`;
        return (
          <g key={si}>
            <polygon points={areaPoints} fill={color} opacity="0.1" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
            {series.values.map((v, i) => {
              const x = padding.left + i * step;
              const y = padding.top + chartH * (1 - v.y / maxVal);
              return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

/* ─── Pie Chart ─── */
interface PieSlice {
  label: string;
  value: number;
  color: string;
}

export const PieChart: React.FC<{
  data: PieSlice[];
  width?: number;
  height?: number;
  title?: string;
  showLegend?: boolean;
}> = ({ data, width = 300, height = 300, title, showLegend = true }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 40;
  let currentAngle = -Math.PI / 2;

  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const midAngle = startAngle + angle / 2;
    const labelX = cx + (radius + 20) * Math.cos(midAngle);
    const labelY = cy + (radius + 20) * Math.sin(midAngle);
    return { ...d, path, labelX, labelY, percent: ((d.value / total) * 100).toFixed(1) };
  });

  return (
    <svg width={width} height={height} className="w-full h-auto">
      {title && <text x={cx} y={18} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">{title}</text>}
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.path} fill={s.color} stroke="#1a1a2e" strokeWidth="2" opacity="0.85" />
          {s.percent !== '0.0' && <text x={s.labelX} y={s.labelY} textAnchor="middle" fill="#e2e8f0" fontSize="9" dominantBaseline="middle">{s.percent}%</text>}
        </g>
      ))}
      {showLegend && (
        <g>
          {data.map((d, i) => (
            <g key={i} transform={`translate(${width - 120}, ${20 + i * 20})`}>
              <rect x={0} y={0} width={10} height={10} rx="2" fill={d.color} />
              <text x={16} y={9} fill="#888" fontSize="9">{d.label}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};

/* ─── Epi Curve (Epidemiological Curve) ─── */
interface EpiCurveData {
  date: string;
  cases: number;
  deaths?: number;
  recovered?: number;
}

export const EpiCurve: React.FC<{
  data: EpiCurveData[];
  width?: number;
  height?: number;
  title?: string;
}> = ({ data, width = 600, height = 300, title }) => {
  const padding = { top: 30, right: 30, bottom: 60, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxCases = Math.max(...data.map((d) => d.cases), 1);
  const barW = Math.max(4, chartW / data.length * 0.8);

  return (
    <svg width={width} height={height} className="w-full h-auto">
      {title && <text x={width / 2} y={18} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">{title}</text>}
      <text x={12} y={height / 2} textAnchor="middle" fill="#888" fontSize="10" transform={`rotate(-90, 12, ${height / 2})`}>Cases</text>
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = padding.top + chartH * (1 - pct);
        const val = Math.round(maxCases * pct);
        return (
          <g key={pct}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#3a3a3a" strokeWidth="0.5" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#888" fontSize="9">{val}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = padding.left + (i * chartW) / data.length + (chartW / data.length - barW) / 2;
        const barH = (d.cases / maxCases) * chartH;
        const y = padding.top + chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="2" fill="#ef4444" opacity="0.7" />
            {d.deaths && (
              <rect x={x + barW + 1} y={padding.top + chartH - (d.deaths / maxCases) * chartH} width={barW * 0.5} height={(d.deaths / maxCases) * chartH} rx="2" fill="#7f1d1d" opacity="0.8" />
            )}
            <text x={x + barW / 2} y={height - padding.bottom + 14} textAnchor="end" fill="#888" fontSize="7" transform={`rotate(-45, ${x + barW / 2}, ${height - padding.bottom + 14})`}>{d.date}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ─── Gantt Chart ─── */
interface GanttTask {
  id: string;
  label: string;
  start: number;
  duration: number;
  progress: number;
  color?: string;
  dependsOn?: string[];
}

export const GanttChart: React.FC<{
  tasks: GanttTask[];
  width?: number;
  height?: number;
  title?: string;
  totalDays?: number;
}> = ({ tasks, width = 600, height: propHeight, title, totalDays = 30 }) => {
  const padding = { top: 30, right: 20, bottom: 20, left: 150 };
  const rowH = 30;
  const chartH = tasks.length * rowH + 20;
  const totalH = chartH + padding.top + padding.bottom;
  const chartW = width - padding.left - padding.right;
  const dayW = chartW / totalDays;

  return (
    <svg width={width} height={Math.max(totalH, propHeight || totalH)} className="w-full h-auto">
      {title && <text x={width / 2} y={18} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">{title}</text>}
      {tasks.map((task, i) => {
        const y = padding.top + i * rowH;
        const x = padding.left + task.start * dayW;
        const barW = task.duration * dayW;
        const color = task.color || '#4f46e5';
        const progressW = barW * (task.progress / 100);
        return (
          <g key={task.id}>
            <text x={padding.left - 10} y={y + rowH / 2 + 4} textAnchor="end" fill="#e2e8f0" fontSize="10">{task.label}</text>
            <rect x={x} y={y + 6} width={barW} height={rowH - 12} rx="4" fill={color} opacity="0.3" />
            <rect x={x} y={y + 6} width={progressW} height={rowH - 12} rx="4" fill={color} opacity="0.85" />
            <text x={x + 4} y={y + rowH / 2 + 4} fill="#fff" fontSize="8">{task.progress}%</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ─── Color-Coded Status Badge ─── */
export const StatusBadge: React.FC<{
  status: 'success' | 'processing' | 'error' | 'info' | 'warning';
  label?: string;
  size?: 'sm' | 'md';
}> = ({ status, label, size = 'sm' }) => {
  const colors = {
    success: { bg: '#10b981', text: '#fff' },
    processing: { bg: '#f59e0b', text: '#000' },
    error: { bg: '#ef4444', text: '#fff' },
    info: { bg: '#3b82f6', text: '#fff' },
    warning: { bg: '#f97316', text: '#000' },
  };
  const c = colors[status];
  const px = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2.5 py-1';
  const fs = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${px} ${fs} font-medium`} style={{ backgroundColor: c.bg + '20', color: c.bg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.bg }} />
      {label || status}
    </span>
  );
};

/* ─── Mini Stat Card ─── */
export const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, value, icon, color = '#4f46e5' }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]">
    {icon && <div style={{ color }}>{icon}</div>}
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
    </div>
  </div>
);

/* ─── Heatmap ─── */
interface HeatmapDataPoint {
  x: string;
  y: string;
  value: number;
}

export const Heatmap: React.FC<{
  data: HeatmapDataPoint[];
  width?: number;
  height?: number;
  title?: string;
}> = ({ data, width = 400, height = 300, title }) => {
  const padding = { top: 30, right: 20, bottom: 60, left: 70 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const xLabels = [...new Set(data.map(d => d.x))];
  const yLabels = [...new Set(data.map(d => d.y))];
  const maxVal = Math.max(...data.map(d => d.value), 1);

  const cellW = chartW / xLabels.length;
  const cellH = chartH / yLabels.length;

  const dataMap = new Map(data.map(d => [`${d.x}:${d.y}`, d.value]));

  return (
    <svg width={width} height={height} className="w-full h-auto">
      {title && <text x={width / 2} y={18} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">{title}</text>}
      {yLabels.map((y, yi) => (
        <text key={y} x={padding.left - 8} y={padding.top + yi * cellH + cellH / 2 + 4} textAnchor="end" fill="#888" fontSize="9">{y}</text>
      ))}
      {xLabels.map((x, xi) => (
        <text key={x} x={padding.left + xi * cellW + cellW / 2} y={height - padding.bottom + 16} textAnchor="end" fill="#888" fontSize="9" transform={`rotate(-35, ${padding.left + xi * cellW + cellW / 2}, ${height - padding.bottom + 16})`}>{x}</text>
      ))}
      {yLabels.map((y, yi) =>
        xLabels.map((x, xi) => {
          const val = dataMap.get(`${x}:${y}`) || 0;
          const intensity = val / maxVal;
          const r = Math.round(30 + 200 * intensity);
          const g = Math.round(50 + 50 * (1 - intensity));
          const b = Math.round(200 * (1 - intensity));
          return (
            <g key={`${x}:${y}`}>
              <rect
                x={padding.left + xi * cellW}
                y={padding.top + yi * cellH}
                width={cellW - 2}
                height={cellH - 2}
                fill={`rgb(${r},${g},${b})`}
                rx="2"
                opacity="0.85"
              />
              <text
                x={padding.left + xi * cellW + (cellW - 2) / 2}
                y={padding.top + yi * cellH + (cellH - 2) / 2 + 3}
                textAnchor="middle"
                fill={intensity > 0.5 ? '#fff' : '#aaa'}
                fontSize="8"
              >{val}</text>
            </g>
          );
        })
      )}
    </svg>
  );
};

/* ─── Scatter ─── */
interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
  size?: number;
}

export const Scatter: React.FC<{
  points: ScatterPoint[];
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  title?: string;
  trendLine?: boolean;
}> = ({ points, width = 400, height = 300, xLabel, yLabel, title, trendLine }) => {
  const padding = { top: 30, right: 20, bottom: 50, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const xMin = Math.min(...points.map(p => p.x), 0);
  const xMax = Math.max(...points.map(p => p.x), 1);
  const yMin = Math.min(...points.map(p => p.y), 0);
  const yMax = Math.max(...points.map(p => p.y), 1);

  const xScale = (v: number) => padding.left + ((v - xMin) / (xMax - xMin)) * chartW;
  const yScale = (v: number) => padding.top + chartH * (1 - (v - yMin) / (yMax - yMin));

  const [hovered, setHovered] = React.useState<number | null>(null);

  let trendLineEl = null;
  if (trendLine && points.length > 1) {
    const n = points.length;
    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const x1 = xMin;
    const y1 = slope * x1 + intercept;
    const x2 = xMax;
    const y2 = slope * x2 + intercept;
    trendLineEl = <line x1={xScale(x1)} y1={yScale(y1)} x2={xScale(x2)} y2={yScale(y2)} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />;
  }

  return (
    <svg width={width} height={height} className="w-full h-auto">
      {title && <text x={width / 2} y={18} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">{title}</text>}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => {
        const y = padding.top + chartH * (1 - pct);
        const val = Math.round(yMin + (yMax - yMin) * pct);
        return (
          <g key={pct}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#3a3a3a" strokeWidth="0.5" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#888" fontSize="9">{val}</text>
          </g>
        );
      })}
      {xLabel && <text x={width / 2} y={height - 6} textAnchor="middle" fill="#888" fontSize="10">{xLabel}</text>}
      {yLabel && <text x={12} y={height / 2} textAnchor="middle" fill="#888" fontSize="10" transform={`rotate(-90, 12, ${height / 2})`}>{yLabel}</text>}
      {trendLineEl}
      {points.map((p, i) => {
        const cx = xScale(p.x);
        const cy = yScale(p.y);
        const isHovered = hovered === i;
        return (
          <g key={i}>
            {isHovered && p.label && (
              <rect x={cx + 8} y={cy - 20} width={p.label.length * 7 + 12} height="18" rx="3" fill="#1a1a2e" stroke="#4f46e5" strokeWidth="0.5" />
            )}
            {isHovered && p.label && (
              <text x={cx + 14} y={cy - 8} fill="#e2e8f0" fontSize="9">{p.label}</text>
            )}
            <circle
              cx={cx} cy={cy} r={p.size || 5}
              fill={p.color || '#4f46e5'}
              opacity={isHovered ? 1 : 0.7}
              stroke={isHovered ? '#fff' : 'none'}
              strokeWidth="1.5"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          </g>
        );
      })}
    </svg>
  );
};

/* ─── Timeline ─── */
interface TimelineEvent {
  date: string;
  label: string;
  description?: string;
  category?: string;
  importance?: 'low' | 'medium' | 'high';
}

export const Timeline: React.FC<{
  events: TimelineEvent[];
  width?: number;
  title?: string;
}> = ({ events, width = 600, title }) => {
  const height = Math.max(120, events.length * 60 + 60);

  const categoryColors: Record<string, string> = {
    default: '#4f46e5',
    disease: '#ef4444',
    intervention: '#22c55e',
    research: '#3b82f6',
    policy: '#f59e0b',
  };

  const importanceRadius: Record<string, number> = {
    low: 4,
    medium: 6,
    high: 8,
  };

  const [hovered, setHovered] = React.useState<number | null>(null);

  const lineX = 100;
  const nodeStartY = 40;

  return (
    <svg width={width} height={height} className="w-full h-auto">
      {title && <text x={width / 2} y={18} textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">{title}</text>}
      <line x1={lineX} y1={nodeStartY} x2={lineX} y2={nodeStartY + events.length * 60} stroke="#3a3a3a" strokeWidth="2" />
      {events.map((ev, i) => {
        const y = nodeStartY + i * 60;
        const color = ev.category ? (categoryColors[ev.category] || categoryColors.default) : categoryColors.default;
        const r = ev.importance ? importanceRadius[ev.importance] : 6;
        const isHovered = hovered === i;
        return (
          <g key={i}>
            <circle cx={lineX} cy={y} r={r} fill={color} stroke="#1a1a2e" strokeWidth="2" style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            {isHovered && ev.description && (
              <rect x={lineX + 15} y={y - 20} width={Math.max(ev.description.length * 6.5 + 16, ev.label.length * 7 + 16)} height="36" rx="4" fill="#1a1a2e" stroke={color} strokeWidth="0.5" />
            )}
            {isHovered && ev.description && (
              <>
                <text x={lineX + 23} y={y - 8} fill="#e2e8f0" fontSize="9" fontWeight="bold">{ev.label}</text>
                <text x={lineX + 23} y={y + 6} fill="#94a3b8" fontSize="8">{ev.description}</text>
              </>
            )}
            {!isHovered && (
              <text x={lineX + 15} y={y + 4} fill="#e2e8f0" fontSize="10">{ev.label}</text>
            )}
            <text x={lineX - 10} y={y + 3} textAnchor="end" fill="#888" fontSize="8">{ev.date}</text>
          </g>
        );
      })}
    </svg>
  );
};

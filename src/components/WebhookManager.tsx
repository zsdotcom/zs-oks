import React, { useState, useEffect } from 'react';
import type { WebhookConfig } from '../services/webhookService';
import { fireWebhooks } from '../services/webhookService';
import { X, Plus, Trash, Zap, Check } from './icons/lucide-shim';

const ALL_EVENTS = ['chat:message', 'file:created', 'memory:stored', 'a2a:complete'];

interface WebhookManagerProps {
  webhooks: WebhookConfig[];
  onAdd: (config: Omit<WebhookConfig, 'id' | 'createdAt'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WebhookConfig>) => void;
}

interface HeaderEntry {
  key: string;
  value: string;
}

export const WebhookManager: React.FC<WebhookManagerProps> = ({ webhooks, onAdd, onRemove, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT'>('POST');
  const [headers, setHeaders] = useState<HeaderEntry[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  const [testResult, setTestResult] = useState<string | null>(null);

  const handleAddHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const handleRemoveHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));
  const handleHeaderChange = (i: number, field: 'key' | 'value', val: string) => {
    const updated = [...headers];
    updated[i] = { ...updated[i], [field]: val };
    setHeaders(updated);
  };

  const toggleEvent = (evt: string) => {
    setEvents((prev) => prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]);
  };

  const handleSubmit = () => {
    if (!name.trim() || !url.trim() || events.length === 0) return;
    const headersObj: Record<string, string> = {};
    headers.forEach((h) => { if (h.key.trim()) headersObj[h.key.trim()] = h.value; });
    onAdd({
      name: name.trim(),
      url: url.trim(),
      method,
      headers: Object.keys(headersObj).length > 0 ? headersObj : undefined,
      events,
      active,
    });
    setName('');
    setUrl('');
    setMethod('POST');
    setHeaders([]);
    setEvents([]);
    setActive(true);
    setShowForm(false);
  };

  const handleTest = async (hook: WebhookConfig) => {
    setTestResult(null);
    try {
      await fireWebhooks(hook.events[0] || 'chat:message', { test: true, from: 'WebhookManager' });
      setTestResult(`Test sent to ${hook.name}`);
    } catch {
      setTestResult(`Test failed for ${hook.name}`);
    }
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1">
          <Zap size={12} /> Webhooks
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs bg-[var(--accent)] text-white px-2 py-1 rounded hover:bg-[var(--accent-dark)] flex items-center gap-1"
        >
          <Plus size={10} /> {showForm ? 'Cancel' : 'Add Webhook'}
        </button>
      </div>

      {testResult && (
        <div className="text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded">{testResult}</div>
      )}

      {showForm && (
        <div className="p-3 rounded bg-[var(--bg-primary)] border border-[var(--border)] space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Webhook name..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/webhook"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50"
          />
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'GET' | 'POST' | 'PUT')}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50"
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
          </select>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[var(--text-muted)]">Headers</span>
              <button onClick={handleAddHeader} className="text-[10px] text-[var(--accent)] hover:text-[var(--accent-light)]">
                + Add
              </button>
            </div>
            {headers.map((h, i) => (
              <div key={i} className="flex gap-1 mb-1">
                <input
                  type="text"
                  value={h.key}
                  onChange={(e) => handleHeaderChange(i, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-[10px] focus:outline-none focus:border-[var(--accent)]/50"
                />
                <input
                  type="text"
                  value={h.value}
                  onChange={(e) => handleHeaderChange(i, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-[10px] focus:outline-none focus:border-[var(--accent)]/50"
                />
                <button onClick={() => handleRemoveHeader(i)} className="p-1 text-red-400 hover:bg-[var(--bg-hover)] rounded">
                  <Trash size={10} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <span className="text-[10px] text-[var(--text-muted)] block mb-1">Events</span>
            <div className="flex flex-wrap gap-2">
              {ALL_EVENTS.map((evt) => (
                <button
                  key={evt}
                  onClick={() => toggleEvent(evt)}
                  className={`text-[10px] px-2 py-1 rounded border ${events.includes(evt) ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-light)]'}`}
                >
                  {events.includes(evt) && <Check size={8} className="inline mr-1" />}
                  {evt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="accent-[var(--accent)]"
            />
            <label className="text-[10px] text-[var(--text-secondary)]">Active</label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !url.trim() || events.length === 0}
            className="w-full py-1.5 bg-[var(--accent)] text-white text-xs rounded hover:bg-[var(--accent-dark)] disabled:opacity-50"
          >
            Save Webhook
          </button>
        </div>
      )}

      {webhooks.length === 0 && !showForm && (
        <p className="text-[10px] text-[var(--text-muted)] text-center py-4">No webhooks configured. Add one to receive events.</p>
      )}

      {webhooks.map((hook) => (
        <div key={hook.id} className="flex items-center gap-2 p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${hook.active ? 'bg-green-400' : 'bg-gray-500'}`} />
              <span className="text-xs font-medium truncate">{hook.name}</span>
            </div>
            <span className="block text-[10px] text-[var(--text-muted)] truncate">{hook.url}</span>
            <span className="text-[10px] text-[var(--text-muted)]">{hook.method} — {hook.events.join(', ')}</span>
          </div>
          <button
            onClick={() => handleTest(hook)}
            className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
            title="Test webhook"
          >
            <Zap size={12} />
          </button>
          <button
            onClick={() => onUpdate(hook.id, { active: !hook.active })}
            className={`p-1 rounded hover:bg-[var(--bg-hover)] ${hook.active ? 'text-green-400' : 'text-[var(--text-muted)]'}`}
            title={hook.active ? 'Disable' : 'Enable'}
          >
            <Check size={12} />
          </button>
          <button onClick={() => onRemove(hook.id)} className="p-1 rounded hover:bg-[var(--bg-hover)] text-red-400" title="Delete">
            <Trash size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

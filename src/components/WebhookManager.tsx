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
        <h3 className="text-xs font-medium text-gray-400 flex items-center gap-1">
          <Zap size={12} /> Webhooks
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 flex items-center gap-1"
        >
          <Plus size={10} /> {showForm ? 'Cancel' : 'Add Webhook'}
        </button>
      </div>

      {testResult && (
        <div className="text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded">{testResult}</div>
      )}

      {showForm && (
        <div className="p-3 rounded bg-[#0f0f1a] border border-[#2a2a3e] space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Webhook name..."
            className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/webhook"
            className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50"
          />
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'GET' | 'POST' | 'PUT')}
            className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50"
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
          </select>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-500">Headers</span>
              <button onClick={handleAddHeader} className="text-[10px] text-indigo-400 hover:text-indigo-300">
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
                  className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded px-2 py-1 text-[10px] focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  value={h.value}
                  onChange={(e) => handleHeaderChange(i, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded px-2 py-1 text-[10px] focus:outline-none focus:border-indigo-500/50"
                />
                <button onClick={() => handleRemoveHeader(i)} className="p-1 text-red-400 hover:bg-[#2a2a3e] rounded">
                  <Trash size={10} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Events</span>
            <div className="flex flex-wrap gap-2">
              {ALL_EVENTS.map((evt) => (
                <button
                  key={evt}
                  onClick={() => toggleEvent(evt)}
                  className={`text-[10px] px-2 py-1 rounded border ${events.includes(evt) ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'border-[#2a2a3e] text-gray-500 hover:border-[#3a3a4e]'}`}
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
              className="accent-indigo-500"
            />
            <label className="text-[10px] text-gray-400">Active</label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !url.trim() || events.length === 0}
            className="w-full py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            Save Webhook
          </button>
        </div>
      )}

      {webhooks.length === 0 && !showForm && (
        <p className="text-[10px] text-gray-500 text-center py-4">No webhooks configured. Add one to receive events.</p>
      )}

      {webhooks.map((hook) => (
        <div key={hook.id} className="flex items-center gap-2 p-2 rounded bg-[#0f0f1a] border border-[#2a2a3e]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${hook.active ? 'bg-green-400' : 'bg-gray-500'}`} />
              <span className="text-xs font-medium truncate">{hook.name}</span>
            </div>
            <span className="block text-[10px] text-gray-500 truncate">{hook.url}</span>
            <span className="text-[10px] text-gray-600">{hook.method} — {hook.events.join(', ')}</span>
          </div>
          <button
            onClick={() => handleTest(hook)}
            className="p-1 rounded hover:bg-[#2a2a3e] text-gray-400"
            title="Test webhook"
          >
            <Zap size={12} />
          </button>
          <button
            onClick={() => onUpdate(hook.id, { active: !hook.active })}
            className={`p-1 rounded hover:bg-[#2a2a3e] ${hook.active ? 'text-green-400' : 'text-gray-500'}`}
            title={hook.active ? 'Disable' : 'Enable'}
          >
            <Check size={12} />
          </button>
          <button onClick={() => onRemove(hook.id)} className="p-1 rounded hover:bg-[#2a2a3e] text-red-400" title="Delete">
            <Trash size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

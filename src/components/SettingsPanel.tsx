import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ProviderConfig, A2AAgent, SandboxSettings } from '../types';
import type { WebhookConfig } from '../services/webhookService';
import { X, Download, Upload, Edit, Trash, Plus, Zap } from './icons/lucide-shim';
import { WebhookManager } from './WebhookManager';

interface Props {
  show: boolean;
  onClose: () => void;
  providerConfig: ProviderConfig;
  onProviderConfigChange: (config: ProviderConfig) => void;
  a2aAgents: A2AAgent[];
  isA2ALoading: boolean;
  onRunDebate: () => void;
  onExportAll: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sandboxSettings: SandboxSettings;
  onSandboxChange: (settings: SandboxSettings) => void;
  onEditAgent: (agent: A2AAgent) => void;
  onCreateAgent: () => void;
  onDeleteAgent: (id: string) => void;
  webhooks: WebhookConfig[];
  onAddWebhook: (config: Omit<WebhookConfig, 'id' | 'createdAt'>) => void;
  onRemoveWebhook: (id: string) => void;
  onUpdateWebhook: (id: string, updates: Partial<WebhookConfig>) => void;
}

const DEFAULT_AGENT_IDS = ['coord', 'research', 'data', 'writer', 'review', 'librarian'];

const SettingsPanel: React.FC<Props> = ({
  show, onClose, providerConfig, onProviderConfigChange,
  a2aAgents, isA2ALoading, onRunDebate, onExportAll, onImport,
  sandboxSettings, onSandboxChange,
  onEditAgent, onCreateAgent, onDeleteAgent,
  webhooks, onAddWebhook, onRemoveWebhook, onUpdateWebhook,
}) => {
  const [tab, setTab] = useState<'general' | 'webhooks'>('general');
  const [showMarketplace, setShowMarketplace] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (show) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => panelRef.current?.focus(), 50);
    }
  }, [show]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      triggerRef.current?.focus();
    }
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => { onClose(); triggerRef.current?.focus(); }}>
      <div ref={panelRef} className="bg-[#1a1a2e] rounded-xl border border-[#2a2a3e] w-full max-w-lg max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="settings-title" tabIndex={-1} onKeyDown={handleKeyDown}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 id="settings-title" className="text-xs font-semibold sr-only">Settings</h2>
            <div className="flex gap-1" role="tablist" aria-label="Settings sections">
              <button
                onClick={() => setTab('general')}
                className={`px-3 py-1 text-xs rounded ${tab === 'general' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                role="tab"
                aria-selected={tab === 'general'}
              >
                General
              </button>
              <button
                onClick={() => setTab('webhooks')}
                className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${tab === 'webhooks' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                role="tab"
                aria-selected={tab === 'webhooks'}
              >
                <Zap size={10} /> Webhooks
              </button>
            </div>
          </div>
          <button onClick={() => { onClose(); triggerRef.current?.focus(); }} aria-label="Close settings"><X size={16} /></button>
        </div>

        {tab === 'general' && (
          <div className="space-y-6">
            {/* LLM Provider */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-400">AI Provider</h3>
              <div className="grid grid-cols-2 gap-2">
                {(['gemini', 'openai', 'anthropic', 'deepseek', 'groq', 'ollama'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => onProviderConfigChange({ ...providerConfig, provider: p })}
                    className={`p-2 rounded-lg text-xs border transition-colors ${providerConfig.provider === p ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-[#2a2a3e] hover:border-[#3a3a4e]'}`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={providerConfig.apiKey}
                onChange={(e) => onProviderConfigChange({ ...providerConfig, apiKey: e.target.value })}
                placeholder="API Key..."
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50"
              />
              <input
                type="text"
                value={providerConfig.selectedModel}
                onChange={(e) => onProviderConfigChange({ ...providerConfig, selectedModel: e.target.value })}
                placeholder="Model (e.g., gemini-3.5-flash)"
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50"
              />
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-400">Temperature:</label>
                <input type="range" min={0} max={1} step={0.1} value={providerConfig.temperature} onChange={(e) => onProviderConfigChange({ ...providerConfig, temperature: parseFloat(e.target.value) })} className="flex-1 accent-indigo-500" />
                <span className="text-xs w-8">{providerConfig.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={providerConfig.enableThinking} onChange={(e) => onProviderConfigChange({ ...providerConfig, enableThinking: e.target.checked })} className="accent-indigo-500" />
                <label className="text-xs">Enable thinking mode</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={providerConfig.enableSearchGrounding} onChange={(e) => onProviderConfigChange({ ...providerConfig, enableSearchGrounding: e.target.checked })} className="accent-indigo-500" />
                <label className="text-xs">Enable web search grounding</label>
              </div>
            </div>

            {/* Sandbox Settings */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-400">Sandbox</h3>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={sandboxSettings.strictSandbox} onChange={(e) => onSandboxChange({ ...sandboxSettings, strictSandbox: e.target.checked })} className="accent-indigo-500" />
                <label className="text-xs">Strict sandbox mode</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={sandboxSettings.allowedOutbound} onChange={(e) => onSandboxChange({ ...sandboxSettings, allowedOutbound: e.target.checked })} className="accent-indigo-500" />
                <label className="text-xs">Allow outbound requests</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={sandboxSettings.showAuditLedger} onChange={(e) => onSandboxChange({ ...sandboxSettings, showAuditLedger: e.target.checked })} className="accent-indigo-500" />
                <label className="text-xs">Show audit ledger</label>
              </div>
            </div>

            {/* Data Management */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-400">Data Management</h3>
              <div className="flex gap-2">
                <button onClick={onExportAll} className="flex items-center gap-1 text-xs bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 hover:border-indigo-500/50">
                  <Download size={12} /> Export All Data
                </button>
                <label className="flex items-center gap-1 text-xs bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 hover:border-indigo-500/50 cursor-pointer">
                  <Upload size={12} /> Import Data
                  <input type="file" accept=".json" onChange={onImport} className="hidden" />
                </label>
              </div>
            </div>

            {/* A2A Agent Management */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-gray-400">A2A Agents</h3>
                <div className="flex gap-1">
                  <button onClick={onCreateAgent} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 flex items-center gap-1">
                    <Plus size={10} /> Create Agent
                  </button>
                  <div className="relative">
                    <button onClick={() => setShowMarketplace(!showMarketplace)} className="text-xs bg-[#0f0f1a] border border-[#2a2a3e] px-2 py-1 rounded hover:border-indigo-500/50 text-gray-400">
                      Marketplace
                    </button>
                    {showMarketplace && (
                      <div className="absolute right-0 top-full mt-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 shadow-xl z-50 whitespace-nowrap">
                        <p className="text-[10px] text-gray-400">Coming Soon</p>
                        <p className="text-[9px] text-gray-600">Browse & install community agents</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {a2aAgents.map((agent) => {
                const isDefault = DEFAULT_AGENT_IDS.includes(agent.id);
                return (
                  <div key={agent.id} className="flex items-center gap-2 p-2 rounded bg-[#0f0f1a] border border-[#2a2a3e]">
                    <span className="text-sm">{agent.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">{agent.name}</span>
                        {isDefault && <span className="text-[9px] text-gray-600">(built-in)</span>}
                      </div>
                      <span className="block text-[10px] text-gray-500 truncate">{agent.role}</span>
                    </div>
                    <button onClick={() => onEditAgent(agent)} className="p-1 rounded hover:bg-[#2a2a3e] text-gray-400" aria-label={`Edit ${agent.name}`}>
                      <Edit size={12} />
                    </button>
                    {!isDefault && (
                      <button onClick={() => onDeleteAgent(agent.id)} className="p-1 rounded hover:bg-[#2a2a3e] text-red-400" aria-label={`Delete ${agent.name}`}>
                        <Trash size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                onClick={onRunDebate}
                disabled={isA2ALoading}
                className="w-full py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isA2ALoading ? 'Running debate...' : 'Run Demo Debate'}
              </button>
            </div>
          </div>
        )}

        {tab === 'webhooks' && (
          <WebhookManager
            webhooks={webhooks}
            onAdd={onAddWebhook}
            onRemove={onRemoveWebhook}
            onUpdate={onUpdateWebhook}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;

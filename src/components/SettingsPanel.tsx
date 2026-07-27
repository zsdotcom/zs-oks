import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ProviderConfig, A2AAgent, SandboxSettings, SkillDefinition, ToolDefinition, LLMProvider } from '../types';
import { PROVIDER_OPTIONS, BUILT_IN_TOOLS } from '../types';
import type { WebhookConfig } from '../services/webhookService';
import { X, Download, Upload, Edit, Trash, Plus, Zap, BookOpen, Wrench, Globe, Check } from './icons/lucide-shim';
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
  skills?: SkillDefinition[];
  onCreateSkill?: () => void;
  onDeleteSkill?: (id: string) => void;
  onTestProvider?: (provider: LLMProvider, apiKey: string) => Promise<boolean>;
  googleOAuthClientId?: string;
  onGoogleOAuthClientIdChange?: (id: string) => void;
  gitHubOAuthClientId?: string;
  onGitHubOAuthClientIdChange?: (id: string) => void;
}

const DEFAULT_AGENT_IDS = ['coord', 'research', 'data', 'writer', 'review', 'librarian'];

const SettingsPanel: React.FC<Props> = ({
  show, onClose, providerConfig, onProviderConfigChange,
  a2aAgents, isA2ALoading, onRunDebate, onExportAll, onImport,
  sandboxSettings, onSandboxChange,
  onEditAgent, onCreateAgent, onDeleteAgent,
  webhooks, onAddWebhook, onRemoveWebhook, onUpdateWebhook,
  skills, onCreateSkill, onDeleteSkill, onTestProvider,
  googleOAuthClientId, onGoogleOAuthClientIdChange,
  gitHubOAuthClientId, onGitHubOAuthClientIdChange,
}) => {
  const [tab, setTab] = useState<'general' | 'agents' | 'skills' | 'tools' | 'knowledge' | 'webhooks'>('general');
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [testResult, setTestResult] = useState<{ provider: string; success: boolean } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (show) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => panelRef.current?.focus(), 50);
    }
  }, [show]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); triggerRef.current?.focus(); }
  }, [onClose]);

  const handleTestProvider = async () => {
    if (!onTestProvider) return;
    setTestResult(null);
    const success = await onTestProvider(providerConfig.provider, providerConfig.apiKey);
    setTestResult({ provider: providerConfig.provider, success });
    setTimeout(() => setTestResult(null), 3000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => { onClose(); triggerRef.current?.focus(); }}>
      <div ref={panelRef} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="settings-title" tabIndex={-1} onKeyDown={handleKeyDown}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 id="settings-title" className="text-xs font-semibold sr-only">Settings</h2>
            <div className="flex gap-1 flex-wrap" role="tablist" aria-label="Settings sections">
              <button onClick={() => setTab('general')} className={`px-3 py-1 text-xs rounded ${tab === 'general' ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`} role="tab" aria-selected={tab === 'general'}>General</button>
              <button onClick={() => setTab('agents')} className={`px-3 py-1 text-xs rounded ${tab === 'agents' ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`} role="tab" aria-selected={tab === 'agents'}>Agents</button>
              <button onClick={() => setTab('skills')} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${tab === 'skills' ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`} role="tab" aria-selected={tab === 'skills'}><BookOpen size={10} /> Skills</button>
              <button onClick={() => setTab('tools')} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${tab === 'tools' ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`} role="tab" aria-selected={tab === 'tools'}><Wrench size={10} /> Tools</button>
              <button onClick={() => setTab('knowledge')} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${tab === 'knowledge' ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`} role="tab" aria-selected={tab === 'knowledge'}><Globe size={10} /> Knowledge</button>
              <button onClick={() => setTab('webhooks')} className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${tab === 'webhooks' ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`} role="tab" aria-selected={tab === 'webhooks'}><Zap size={10} /> Webhooks</button>
            </div>
          </div>
          <button onClick={() => { onClose(); triggerRef.current?.focus(); }} aria-label="Close settings"><X size={16} /></button>
        </div>

        {tab === 'general' && (
          <div className="space-y-6">
            {/* LLM Provider */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">AI Provider</h3>
              <div className="grid grid-cols-5 gap-2">
                {PROVIDER_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onProviderConfigChange({ ...providerConfig, provider: p.id })}
                    className={`p-2 rounded-lg text-xs border transition-colors ${providerConfig.provider === p.id ? 'border-[var(--accent)] bg-[var(--accent-subtler)] text-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--border-light)]'}`}
                    title={p.freeTier}
                  >
                    {p.name.split(' ')[0]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={providerConfig.apiKey} onChange={(e) => onProviderConfigChange({ ...providerConfig, apiKey: e.target.value })} placeholder="API Key..." className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]/50" />
                <button onClick={handleTestProvider} className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-xs hover:border-[var(--accent)]/50 flex items-center gap-1">
                  Test {testResult && (testResult.success ? <Check size={12} className="text-green-400" /> : <X size={12} className="text-red-400" />)}
                </button>
              </div>
              <input type="text" value={providerConfig.selectedModel} onChange={(e) => onProviderConfigChange({ ...providerConfig, selectedModel: e.target.value })} placeholder="Model name..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]/50" />
              {providerConfig.provider === 'cloudflare' && (
                <input type="text" value={providerConfig.customEndpoint || ''} onChange={(e) => onProviderConfigChange({ ...providerConfig, customEndpoint: e.target.value })} placeholder="Cloudflare Account ID..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]/50" />
              )}
              <div className="flex items-center gap-3">
                <label className="text-xs text-[var(--text-secondary)]">Temperature:</label>
                <input type="range" min={0} max={1} step={0.1} value={providerConfig.temperature} onChange={(e) => onProviderConfigChange({ ...providerConfig, temperature: parseFloat(e.target.value) })} className="flex-1 accent-[var(--accent)]" />
                <span className="text-xs w-8">{providerConfig.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={providerConfig.enableThinking} onChange={(e) => onProviderConfigChange({ ...providerConfig, enableThinking: e.target.checked })} className="accent-[var(--accent)]" />
                <label className="text-xs">Enable thinking mode</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={providerConfig.enableSearchGrounding} onChange={(e) => onProviderConfigChange({ ...providerConfig, enableSearchGrounding: e.target.checked })} className="accent-[var(--accent)]" />
                <label className="text-xs">Enable web search grounding</label>
              </div>
            </div>

            {/* Sandbox Settings */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Sandbox</h3>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={sandboxSettings.strictSandbox} onChange={(e) => onSandboxChange({ ...sandboxSettings, strictSandbox: e.target.checked })} className="accent-[var(--accent)]" />
                <label className="text-xs">Strict sandbox mode</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={sandboxSettings.allowedOutbound} onChange={(e) => onSandboxChange({ ...sandboxSettings, allowedOutbound: e.target.checked })} className="accent-[var(--accent)]" />
                <label className="text-xs">Allow outbound requests</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={sandboxSettings.showAuditLedger} onChange={(e) => onSandboxChange({ ...sandboxSettings, showAuditLedger: e.target.checked })} className="accent-[var(--accent)]" />
                <label className="text-xs">Show audit ledger</label>
              </div>
            </div>

            {/* Google OAuth */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Google OAuth</h3>
              <p className="text-[9px] text-[var(--text-muted)]">Required for Google Workspace integration (Drive, Docs, Sheets, Gmail). Create an OAuth client ID in <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Google Cloud Console</a>.</p>
              <input
                type="text"
                value={googleOAuthClientId || ''}
                onChange={(e) => onGoogleOAuthClientIdChange?.(e.target.value)}
                placeholder="Paste Google OAuth Client ID..."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]/50"
              />
            </div>

            {/* GitHub OAuth */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">GitHub OAuth</h3>
              <p className="text-[9px] text-[var(--text-muted)]">Required for GitHub sign-in. Create an OAuth App in <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">GitHub Developer Settings</a> (use device flow — no secret needed).</p>
              <input
                type="text"
                value={gitHubOAuthClientId || ''}
                onChange={(e) => onGitHubOAuthClientIdChange?.(e.target.value)}
                placeholder="Paste GitHub OAuth Client ID..."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]/50"
              />
            </div>

            {/* Data Management */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Data Management</h3>
              <div className="flex gap-2">
                <button onClick={onExportAll} className="flex items-center gap-1 text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 hover:border-[var(--accent)]/50"><Download size={12} /> Export All Data</button>
                <label className="flex items-center gap-1 text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 hover:border-[var(--accent)]/50 cursor-pointer"><Upload size={12} /> Import Data<input type="file" accept=".json" onChange={onImport} className="hidden" /></label>
              </div>
            </div>
          </div>
        )}

        {tab === 'agents' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">A2A Agents ({a2aAgents.length})</h3>
              <div className="flex gap-1">
                <button onClick={onCreateAgent} className="text-xs bg-[var(--accent)] text-white px-2 py-1 rounded hover:bg-[var(--accent-dark)] flex items-center gap-1"><Plus size={10} /> Create Agent</button>
                <div className="relative">
                  <button onClick={() => setShowMarketplace(!showMarketplace)} className="text-xs bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-1 rounded hover:border-[var(--accent)]/50 text-[var(--text-secondary)]">Marketplace</button>
                  {showMarketplace && (
                    <div className="absolute right-0 top-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 shadow-xl z-50 w-64">
                      <p className="text-xs text-[var(--accent)] font-medium mb-2">Agent Marketplace</p>
                      <p className="text-[10px] text-[var(--text-muted)] mb-2">Browse & install community-contributed agents. Marketplace coming soon — build your own agents via the Create Agent button.</p>
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] opacity-50"><p className="text-xs">Literature Analyst</p><p className="text-[9px] text-[var(--text-muted)]">Specialized in paper review</p></div>
                        <div className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)] opacity-50"><p className="text-xs">Code Reviewer</p><p className="text-[9px] text-[var(--text-muted)]">Static analysis expert</p></div>
                        <p className="text-[9px] text-[var(--text-muted)] text-center pt-1">More coming soon...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {a2aAgents.map((agent) => {
              const isDefault = DEFAULT_AGENT_IDS.includes(agent.id);
              return (
                <div key={agent.id} className="flex items-center gap-2 p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)]">
                  <span className="text-sm">{agent.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{agent.name}</span>
                      {isDefault && <span className="text-[9px] text-[var(--text-muted)]">(built-in)</span>}
                      {agent.memoryType && agent.memoryType !== 'session' && <span className="text-[9px] text-[var(--text-muted)]">({agent.memoryType})</span>}
                    </div>
                    <span className="block text-[10px] text-[var(--text-muted)] truncate">{agent.role}</span>
                    <div className="flex gap-1 mt-1">
                      {agent.skills?.map((s) => <span key={s} className="text-[8px] px-1 py-0.5 rounded bg-[var(--accent-subtler)] text-[var(--accent)]">{s}</span>)}
                      {agent.tools?.slice(0, 3).map((t) => <span key={t} className="text-[8px] px-1 py-0.5 rounded bg-green-500/10 text-green-400">{t}</span>)}
                    </div>
                  </div>
                  <button onClick={() => onEditAgent(agent)} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]" aria-label={`Edit ${agent.name}`}><Edit size={12} /></button>
                  {!isDefault && <button onClick={() => onDeleteAgent(agent.id)} className="p-1 rounded hover:bg-[var(--bg-hover)] text-red-400" aria-label={`Delete ${agent.name}`}><Trash size={12} /></button>}
                </div>
              );
            })}
            <button onClick={onRunDebate} disabled={isA2ALoading} className="w-full py-2 bg-[var(--accent)] text-white text-xs rounded-lg hover:bg-[var(--accent-dark)] disabled:opacity-50 flex items-center justify-center gap-1">
              {isA2ALoading ? 'Running debate...' : 'Run Demo Debate'}
            </button>
          </div>
        )}

        {tab === 'skills' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Skills Registry ({skills?.length || 0})</h3>
              {onCreateSkill && (
                <button onClick={onCreateSkill} className="text-xs bg-[var(--accent)] text-white px-2 py-1 rounded hover:bg-[var(--accent-dark)] flex items-center gap-1"><Plus size={10} /> Create Skill</button>
              )}
            </div>
            {(skills || []).map((skill) => (
              <div key={skill.id} className="p-3 rounded bg-[var(--bg-primary)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{skill.name.replace(/-/g, ' ')}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      skill.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                      skill.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
                    }`}>{skill.priority}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--accent-subtler)] text-[var(--accent)]">{skill.category}</span>
                  </div>
                  {onDeleteSkill && <button onClick={() => onDeleteSkill(skill.id)} className="p-1 rounded hover:bg-[var(--bg-hover)] text-red-400"><Trash size={12} /></button>}
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mb-1">{skill.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {skill.triggers.map((t) => <span key={t} className="text-[8px] px-1 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)]">{t}</span>)}
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {skill.allowedTools.map((t) => <span key={t} className="text-[8px] px-1 py-0.5 rounded bg-green-500/10 text-green-400">{t}</span>)}
                </div>
              </div>
            ))}
            {(skills || []).length === 0 && <p className="text-xs text-[var(--text-muted)] text-center py-4">No skills defined. Create a skill to enable auto-activation.</p>}
          </div>
        )}

        {tab === 'tools' && (
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">Built-in Tools ({BUILT_IN_TOOLS.length})</h3>
            <div className="grid grid-cols-2 gap-2">
              {BUILT_IN_TOOLS.map((tool) => (
                <div key={tool.id} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{tool.name}</span>
                    <div className="flex gap-1">
                      <span className={`text-[8px] px-1 py-0.5 rounded ${
                        tool.permission === 'safe' ? 'bg-green-500/10 text-green-400' :
                        tool.permission === 'standard' ? 'bg-blue-500/10 text-blue-400' :
                        tool.permission === 'elevated' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                      }`}>{tool.permission}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)]">{tool.description}</p>
                  <div className="flex gap-1 mt-1">
                    <span className={`text-[8px] px-1 py-0.5 rounded ${tool.requiresConfirmation ? 'bg-orange-500/10 text-orange-400' : 'bg-gray-500/10 text-[var(--text-secondary)]'}`}>
                      {tool.requiresConfirmation ? 'Requires confirm' : 'Auto'}
                    </span>
                    <span className="text-[8px] px-1 py-0.5 rounded bg-gray-500/10 text-[var(--text-secondary)]">{tool.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'knowledge' && (
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">Knowledge Sources</h3>
            <p className="text-[10px] text-[var(--text-muted)]">Free, open knowledge sources available for agent queries. No API keys required.</p>
            <div className="space-y-2">
              {[
                { name: 'Wikipedia', desc: 'Encyclopedic articles', rate: 'Unlimited' },
                { name: 'arXiv', desc: 'Academic preprints', rate: 'Unlimited' },
                { name: 'OpenAlex', desc: 'Scholarly works & citations', rate: '100K/day' },
                { name: 'PubMed', desc: 'Biomedical literature', rate: '10/sec' },
                { name: 'Semantic Scholar', desc: 'Paper summaries & TLDRs', rate: '100/sec' },
                { name: 'WHO GHO', desc: 'Global health indicators', rate: 'Unlimited' },
                { name: 'GDELT', desc: 'Global news monitoring', rate: '20/min' },
                { name: 'CrossRef', desc: 'DOI lookup & metadata', rate: '50/sec' },
              ].map((src) => (
                <div key={src.name} className="flex items-center justify-between p-2 rounded bg-[var(--bg-primary)] border border-[var(--border)]">
                  <div>
                    <span className="text-xs font-medium">{src.name}</span>
                    <p className="text-[9px] text-[var(--text-muted)]">{src.desc}</p>
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)]">{src.rate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'webhooks' && (
          <WebhookManager webhooks={webhooks} onAdd={onAddWebhook} onRemove={onRemoveWebhook} onUpdate={onUpdateWebhook} />
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;

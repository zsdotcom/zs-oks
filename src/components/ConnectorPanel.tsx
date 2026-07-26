import React, { useState, useEffect } from 'react';
import { ConnectorConfig } from '../types';
import { loadConnectors, getConnectors, addConnector, removeConnector, testGitHubConnection, testSlackWebhook, fetchRSSFeed } from '../services/connectorService';

const CONNECTOR_TYPES: { type: ConnectorConfig['type']; icon: string; fields: { key: string; label: string; type: string; placeholder: string }[] }[] = [
  {
    type: 'github', icon: '🐙',
    fields: [
      { key: 'token', label: 'GitHub Token', type: 'password', placeholder: 'ghp_...' },
      { key: 'repo', label: 'Default Repository', type: 'text', placeholder: 'owner/repo' },
    ],
  },
  {
    type: 'slack', icon: '💬',
    fields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'url', placeholder: 'https://hooks.slack.com/...' },
    ],
  },
  {
    type: 'rss', icon: '📡',
    fields: [
      { key: 'feedUrl', label: 'RSS Feed URL', type: 'url', placeholder: 'https://example.com/feed.xml' },
    ],
  },
  {
    type: 'email', icon: '📧',
    fields: [
      { key: 'to', label: 'Default Recipient', type: 'email', placeholder: 'user@example.com' },
    ],
  },
  {
    type: 'webhook', icon: '🔗',
    fields: [
      { key: 'url', label: 'Webhook URL', type: 'url', placeholder: 'https://example.com/webhook' },
      { key: 'secret', label: 'Secret (optional)', type: 'password', placeholder: 'shared-secret' },
    ],
  },
];

export const ConnectorPanel: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnector, setNewConnector] = useState<{ name: string; type: ConnectorConfig['type']; config: Record<string, string> }>({
    name: '', type: 'github', config: {},
  });

  useEffect(() => {
    loadConnectors().then(() => {
      setConnectors(getConnectors());
    });
  }, []);

  const handleFieldChange = (key: string, value: string) => {
    setNewConnector((prev) => ({
      ...prev,
      config: { ...prev.config, [key]: value },
    }));
  };

  const handleAdd = async () => {
    if (!newConnector.name.trim()) return;
    await addConnector({
      id: `conn-${Date.now()}`,
      name: newConnector.name,
      type: newConnector.type,
      enabled: true,
      config: newConnector.config,
    });
    setConnectors(getConnectors());
    setShowAddForm(false);
    setNewConnector({ name: '', type: 'github', config: {} });
  };

  const handleRemove = (id: string) => {
    removeConnector(id);
    setConnectors(getConnectors());
  };

  const handleTest = async (connector: ConnectorConfig) => {
    let success = false;
    try {
      if (connector.type === 'github') {
        success = await testGitHubConnection(connector.config.token || '');
      } else if (connector.type === 'slack') {
        success = await testSlackWebhook(connector.config.webhookUrl || '');
      } else if (connector.type === 'rss') {
        const feed = await fetchRSSFeed(connector.config.feedUrl || '');
        success = feed.length > 0;
      } else {
        success = true;
      }
    } catch {
      success = false;
    }
    setConnectors((prev) => prev.map((c) =>
      c.id === connector.id ? { ...c, status: success ? 'connected' as const : 'error' as const } : c
    ));
  };

  const activeTypeConfig = CONNECTOR_TYPES.find((t) => t.type === newConnector.type);

  return (
    <div className="p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-[var(--text-primary)]">
          <span>🔌</span> Connectors
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-[10px] px-2 py-1 rounded bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)]/30 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Connector'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] space-y-2">
          <input
            type="text"
            placeholder="Connector name"
            value={newConnector.name}
            onChange={(e) => setNewConnector((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full text-[10px] px-2 py-1.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-600 focus:outline-none focus:border-[var(--accent)]"
          />
          <div className="flex gap-2">
            {CONNECTOR_TYPES.map((t) => (
              <button
                key={t.type}
                onClick={() => setNewConnector((prev) => ({ ...prev, type: t.type, config: {} }))}
                className={`text-[10px] px-2 py-1 rounded transition-colors ${
                  newConnector.type === t.type ? 'bg-[var(--accent-subtle)] text-[var(--accent)]' : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t.icon} {t.type}
              </button>
            ))}
          </div>
          {activeTypeConfig?.fields.map((field) => (
            <input
              key={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={newConnector.config[field.key] || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full text-[10px] px-2 py-1.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-600 focus:outline-none focus:border-[var(--accent)]"
            />
          ))}
          <button
            onClick={handleAdd}
            disabled={!newConnector.name.trim()}
            className="text-[10px] px-3 py-1.5 rounded bg-[var(--accent)] text-white hover:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Connector
          </button>
        </div>
      )}

      {connectors.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <p className="text-xs mb-2">No connectors configured</p>
          <p className="text-[10px]">Add a connector to integrate with external services</p>
        </div>
      ) : (
        <div className="space-y-2">
          {connectors.map((connector) => {
            const typeConfig = CONNECTOR_TYPES.find((t) => t.type === connector.type);
            return (
              <div key={connector.id} className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{typeConfig?.icon || '🔌'}</span>
                    <span className="text-xs font-medium text-[var(--text-primary)]">{connector.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--accent-subtler)] text-[var(--accent)]">{connector.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      connector.status === 'connected' ? 'bg-green-500/10 text-green-400' :
                      connector.status === 'error' ? 'bg-red-500/10 text-red-400' :
                      'bg-gray-500/10 text-[var(--text-secondary)]'
                    }`}>
                      {connector.status}
                    </span>
                    <button
                      onClick={() => handleTest(connector)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                      title="Test connection"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => handleRemove(connector.id)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-[9px] text-[var(--text-muted)] space-y-0.5">
                  {Object.entries(connector.config).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="text-[var(--text-muted)]">{key}:</span>
                      <span className="text-[var(--text-secondary)] truncate max-w-[200px]">
                        {key.includes('token') || key.includes('secret') || key.includes('key')
                          ? '••••••••' : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
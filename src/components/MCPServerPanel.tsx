import React, { useState } from 'react';
import { MCPServer, MCPTool } from '../types';
import { Database, Plus, Trash, Wifi, WifiOff } from './icons/lucide-shim';

interface Props {
  servers: MCPServer[];
  onAddServer: (server: MCPServer) => void;
  onRemoveServer: (id: string) => void;
  onToggleTool: (serverId: string, toolName: string) => void;
}

export const MCPServerPanel: React.FC<Props> = ({ servers, onAddServer, onRemoveServer, onToggleTool }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [newToolName, setNewToolName] = useState('');
  const [expandedServer, setExpandedServer] = useState<string | null>(null);

  const handleAdd = () => {
    if (!name.trim()) return;
    const server: MCPServer = {
      id: `mcp-${Date.now()}`,
      name: name.trim(),
      description: desc.trim(),
      status: 'disconnected',
      tools: [],
    };
    onAddServer(server);
    setName('');
    setDesc('');
    setShowAdd(false);
  };

  const addTool = (serverId: string) => {
    if (!newToolName.trim()) return;
    const tool: MCPTool = {
      name: newToolName.trim(),
      description: '',
      parameters: '',
      isActive: true,
    };
    const server = servers.find((s) => s.id === serverId);
    if (server) {
      onAddServer({ ...server, tools: [...server.tools, tool] });
    }
    setNewToolName('');
  };

  const removeTool = (serverId: string, toolName: string) => {
    const server = servers.find((s) => s.id === serverId);
    if (server) {
      onAddServer({ ...server, tools: server.tools.filter((t) => t.name !== toolName) });
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-indigo-400" />
          <h2 className="text-sm font-semibold">MCP Servers</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="p-1 rounded hover:bg-[#2a2a3e]" aria-label="Add MCP server" aria-expanded={showAdd}><Plus size={14} /></button>
      </div>

      {showAdd && (
        <div className="mb-4 p-3 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e] space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Server name..." className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500/50" autoFocus />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)..." className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500/50" />
          <button onClick={handleAdd} className="w-full py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">Add Server</button>
        </div>
      )}

      {servers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Database size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-xs">No MCP servers configured</p>
          <p className="text-[10px] text-gray-600 mt-1">Add servers to extend agent capabilities</p>
        </div>
      ) : (
        <div className="space-y-2">
          {servers.map((server) => (
            <div key={server.id} className="bg-[#1a1a2e] rounded-lg border border-[#2a2a3e] overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#2a2a3e]" onClick={() => setExpandedServer(expandedServer === server.id ? null : server.id)} role="button" tabIndex={0} aria-expanded={expandedServer === server.id} aria-label={`${server.name} server`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedServer(expandedServer === server.id ? null : server.id); } }}>
                {server.status === 'connected' ? <Wifi size={12} className="text-green-400" /> : <WifiOff size={12} className="text-gray-500" />}
                <span className="text-xs font-medium flex-1">{server.name}</span>
                <span className="text-[10px] text-gray-500">{server.tools.length} tools</span>
                <button onClick={(e) => { e.stopPropagation(); onRemoveServer(server.id); }} className="p-0.5 hover:text-red-400" aria-label={`Remove ${server.name}`}><Trash size={10} /></button>
              </div>
              {expandedServer === server.id && (
                <div className="px-3 py-2 border-t border-[#2a2a3e] space-y-1">
                  {server.description && <p className="text-[10px] text-gray-500 mb-2">{server.description}</p>}
                  <div className="flex items-center gap-2 mb-1">
                    <input value={newToolName} onChange={(e) => setNewToolName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTool(server.id)} placeholder="Tool name..." className="flex-1 bg-[#0f0f1a] border border-[#2a2a3e] rounded px-2 py-1 text-[10px] focus:outline-none focus:border-indigo-500/50" />
                    <button onClick={() => addTool(server.id)} className="px-2 py-1 bg-indigo-600 text-white text-[10px] rounded hover:bg-indigo-700">Add</button>
                  </div>
                  {server.tools.map((tool) => (
                    <div key={tool.name} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#0f0f1a] text-[10px]">
                      <input type="checkbox" checked={tool.isActive} onChange={() => onToggleTool(server.id, tool.name)} className="accent-indigo-500" />
                      <span className="flex-1">{tool.name}</span>
                      <button onClick={() => removeTool(server.id, tool.name)} className="p-0.5 hover:text-red-400"><Trash size={8} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

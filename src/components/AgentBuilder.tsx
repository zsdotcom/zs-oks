import React, { useState } from 'react';
import type { A2AAgent, LLMProvider } from '../types';
import { X } from './icons/lucide-shim';

interface AgentBuilderProps {
  onSave: (agent: A2AAgent) => void;
  onClose: () => void;
  editAgent?: A2AAgent;
  allSkills?: string[];
}

const AVATARS = ['🤖', '🧠', '🔬', '📊', '✍️', '🔍', '📚', '⚙️', '🎯', '💡', '🛡️', '🔧'];
const COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16', '#3B82F6', '#22C55E'];
const MEMORY_TYPES = ['none', 'session', 'persistent', 'full'] as const;
const PROVIDERS: LLMProvider[] = ['gemini', 'openai', 'anthropic', 'deepseek', 'groq', 'ollama', 'openrouter', 'cerebras', 'github', 'cloudflare'];
const SKILL_OPTIONS = ['outbreak-analysis', 'literature-review', 'report-writing', 'statistical-analysis', 'data-fetching'];

export const AgentBuilder: React.FC<AgentBuilderProps> = ({ onSave, onClose, editAgent, allSkills }) => {
  const [name, setName] = useState(editAgent?.name || '');
  const [role, setRole] = useState(editAgent?.role || '');
  const [systemPrompt, setSystemPrompt] = useState(editAgent?.systemPrompt || '');
  const [avatar, setAvatar] = useState(editAgent?.avatar || AVATARS[0]);
  const [color, setColor] = useState(editAgent?.color || COLORS[0]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(editAgent?.skills || []);
  const [selectedTools, setSelectedTools] = useState<string[]>(editAgent?.tools || []);
  const [memoryType, setMemoryType] = useState(editAgent?.memoryType || 'session');
  const [maxTurnDepth, setMaxTurnDepth] = useState(editAgent?.maxTurnDepth || 10);
  const [provider, setProvider] = useState<LLMProvider | undefined>(editAgent?.provider);
  const [modelName, setModelName] = useState(editAgent?.modelName || '');

  const handleSave = () => {
    if (!name.trim() || !role.trim() || !systemPrompt.trim()) return;
    onSave({
      id: editAgent?.id || `custom-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      systemPrompt: systemPrompt.trim(),
      avatar,
      color,
      isActive: true,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      tools: selectedTools.length > 0 ? selectedTools : undefined,
      memoryType: memoryType as any,
      maxTurnDepth,
      provider,
      modelName: modelName || undefined,
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const toolOptions = ['search-web', 'search-wikipedia', 'search-arxiv', 'search-openalex', 'search-pubmed', 'search-who', 'calculate', 'draw-chart', 'draw-diagram', 'render-latex', 'translate', 'speak', 'read-file', 'write-file', 'vectorize', 'semantic-search', 'export-pdf', 'rss-fetch'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">{editAgent ? 'Edit Agent' : 'Create Agent'}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#2a2a3e]"><X size={14} /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Agent name..." className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50" />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Role</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Security Analyst..." className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50" />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Avatar</label>
              <div className="grid grid-cols-6 gap-1">
                {AVATARS.map((a) => (
                  <button key={a} onClick={() => setAvatar(a)} className={`text-lg p-1.5 rounded ${avatar === a ? 'bg-indigo-500/20 ring-1 ring-indigo-500' : 'hover:bg-[#2a2a3e]'}`}>{a}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Color</label>
              <div className="flex gap-1 flex-wrap">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1a1a2e]' : ''}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Memory Type</label>
              <select value={memoryType} onChange={(e) => setMemoryType(e.target.value as any)} className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50">
                {MEMORY_TYPES.map((mt) => <option key={mt} value={mt}>{mt.charAt(0).toUpperCase() + mt.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Max Turn Depth</label>
              <input type="number" min={1} max={100} value={maxTurnDepth} onChange={(e) => setMaxTurnDepth(parseInt(e.target.value) || 10)} className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Provider (override)</label>
              <select value={provider || ''} onChange={(e) => setProvider(e.target.value ? e.target.value as LLMProvider : undefined)} className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50">
                <option value="">Use global provider</option>
                {PROVIDERS.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Model Name</label>
              <input type="text" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Override model..." className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50" />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Skills</label>
              <div className="flex flex-wrap gap-1">
                {(allSkills || SKILL_OPTIONS).map((skill) => (
                  <button key={skill} onClick={() => toggleSkill(skill)} className={`px-2 py-0.5 text-[10px] rounded-full border ${selectedSkills.includes(skill) ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'border-[#2a2a3e] text-gray-500 hover:border-gray-400'}`}>
                    {skill.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Allowed Tools</label>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {toolOptions.map((tool) => (
                  <button key={tool} onClick={() => toggleTool(tool)} className={`px-2 py-0.5 text-[10px] rounded-full border ${selectedTools.includes(tool) ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-[#2a2a3e] text-gray-500 hover:border-gray-400'}`}>
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-400 block mb-1">System Prompt</label>
          <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="You are an agent that..." rows={5} className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500/50 resize-y" />
        </div>

        <div className="flex gap-2 pt-4">
          <button onClick={handleSave} disabled={!name.trim() || !role.trim() || !systemPrompt.trim()} className="flex-1 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {editAgent ? 'Save Changes' : 'Create Agent'}
          </button>
          <button onClick={onClose} className="py-2 px-4 bg-[#0f0f1a] border border-[#2a2a3e] text-xs rounded-lg hover:border-[#3a3a4e]">Cancel</button>
        </div>
      </div>
    </div>
  );
};

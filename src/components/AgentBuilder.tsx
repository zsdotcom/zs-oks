import React, { useState } from 'react';
import type { A2AAgent } from '../types';
import { X } from './icons/lucide-shim';

interface AgentBuilderProps {
  onSave: (agent: A2AAgent) => void;
  onClose: () => void;
  editAgent?: A2AAgent;
}

const AVATARS = ['🤖', '🧠', '🔬', '📊', '✍️', '🔍', '📚', '⚙️', '🎯', '💡', '🛡️', '🔧'];
const COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16', '#3B82F6', '#22C55E'];

export const AgentBuilder: React.FC<AgentBuilderProps> = ({ onSave, onClose, editAgent }) => {
  const [name, setName] = useState(editAgent?.name || '');
  const [role, setRole] = useState(editAgent?.role || '');
  const [systemPrompt, setSystemPrompt] = useState(editAgent?.systemPrompt || '');
  const [avatar, setAvatar] = useState(editAgent?.avatar || AVATARS[0]);
  const [color, setColor] = useState(editAgent?.color || COLORS[0]);

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
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">{editAgent ? 'Edit Agent' : 'Create Agent'}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#2a2a3e]"><X size={14} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent name..."
              className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Security Analyst, Code Reviewer..."
              className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Avatar</label>
            <div className="grid grid-cols-6 gap-1">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`text-lg p-1.5 rounded ${avatar === a ? 'bg-indigo-500/20 ring-1 ring-indigo-500' : 'hover:bg-[#2a2a3e]'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Color</label>
            <div className="flex gap-1 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1a1a2e]' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are an agent that..."
              rows={6}
              className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500/50 resize-y"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={!name.trim() || !role.trim() || !systemPrompt.trim()}
              className="flex-1 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {editAgent ? 'Save Changes' : 'Create Agent'}
            </button>
            <button onClick={onClose} className="py-2 px-4 bg-[#0f0f1a] border border-[#2a2a3e] text-xs rounded-lg hover:border-[#3a3a4e]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

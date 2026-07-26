import React, { useState } from 'react';
import { ChatSession } from '../types';
import { MessageSquare, Plus, Trash, X } from './icons/lucide-shim';

interface Props {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const ChatSessionSidebar: React.FC<Props> = ({
  sessions, activeSessionId, onSwitch, onCreate, onDelete, onClose,
}) => {
  return (
    <div className="w-56 border-r border-[#2a2a3e] bg-[#1a1a2e]/50 flex flex-col shrink-0" role="navigation" aria-label="Chat sessions">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2a3e]">
        <span className="text-xs font-medium text-gray-400">Chats</span>
        <div className="flex gap-1">
          <button onClick={onCreate} className="p-1 rounded hover:bg-[#2a2a3e]" title="New chat"><Plus size={12} /></button>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#2a2a3e]" title="Close"><X size={12} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer group ${
              activeSessionId === s.id ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-[#2a2a3e] text-gray-300'
            }`}
            onClick={() => onSwitch(s.id)}
            aria-current={activeSessionId === s.id ? 'page' : undefined}
          >
            <MessageSquare size={12} className="shrink-0" />
            <span className="flex-1 truncate">{s.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
              className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-red-400"
            >
              <Trash size={10} />
            </button>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="text-[10px] text-gray-500 text-center py-4">No chat sessions</p>
        )}
      </div>
    </div>
  );
};

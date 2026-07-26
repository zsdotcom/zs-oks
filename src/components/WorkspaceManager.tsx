import React, { useState } from 'react';
import type { KBFile, KBFolder, A2AAgent, DocumentTag } from '../types';
import { Plus, Trash, Folder, FileText, Users, Tag } from './icons/lucide-shim';

interface Props {
  files: KBFile[];
  folders: KBFolder[];
  agents: A2AAgent[];
  tags: DocumentTag[];
  activeProjectId: string | null;
  onSwitchProject: (projectId: string) => void;
  onCreateProject: (name: string) => void;
  onDeleteProject: (projectId: string) => void;
  onAddAgent: (agentId: string) => void;
  onRemoveAgent: (agentId: string) => void;
}

interface Project {
  id: string;
  name: string;
  fileCount: number;
  agentCount: number;
  createdAt: Date;
}

const WorkspaceManager: React.FC<Props> = ({
  files, folders, agents, tags, activeProjectId,
  onSwitchProject, onCreateProject, onDeleteProject,
  onAddAgent, onRemoveAgent,
}) => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const projects: Project[] = [
    {
      id: 'default',
      name: 'Default Workspace',
      fileCount: files.length,
      agentCount: agents.length,
      createdAt: new Date(),
    },
  ];

  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    onCreateProject(projectName.trim());
    setProjectName('');
    setShowNewProject(false);
  };

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder size={14} className="text-indigo-400" />
          <h2 className="text-xs font-semibold">Workspaces</h2>
        </div>
        <button
          onClick={() => setShowNewProject(!showNewProject)}
          className="p-1 rounded hover:bg-[#2a2a3e] text-gray-400"
          title="New Workspace"
        >
          <Plus size={14} />
        </button>
      </div>

      {showNewProject && (
        <div className="flex gap-1">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
            placeholder="Workspace name..."
            className="flex-1 bg-[#0f0f1a] border border-[#2a2a3e] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500/50"
            autoFocus
          />
          <button
            onClick={handleCreateProject}
            className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      )}

      {/* Project List */}
      <div className="space-y-1">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
              activeProjectId === project.id
                ? 'bg-indigo-600/20 border border-indigo-500/30'
                : 'hover:bg-[#2a2a3e] border border-transparent'
            }`}
            onClick={() => onSwitchProject(project.id)}
          >
            <Folder size={14} className="text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium truncate block">{project.name}</span>
              <span className="text-[10px] text-gray-500">
                {project.fileCount} files · {project.agentCount} agents
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
              className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
              title="Delete workspace"
            >
              <Trash size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Active Project Details */}
      {activeProjectId && (
        <div className="space-y-3 pt-3 border-t border-[#2a2a3e]">
          {/* Files in workspace */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={12} className="text-gray-500" />
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Files</span>
            </div>
            <div className="space-y-1">
              {files.slice(0, 5).map((file) => (
                <div key={file.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2a2a3e] text-xs">
                  <FileText size={12} className="text-gray-500 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
              {files.length > 5 && (
                <p className="text-[10px] text-gray-500 px-2">+{files.length - 5} more files</p>
              )}
              {files.length === 0 && (
                <p className="text-[10px] text-gray-600 px-2">No files yet</p>
              )}
            </div>
          </div>

          {/* Agents in workspace */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users size={12} className="text-gray-500" />
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Agents</span>
            </div>
            <div className="space-y-1">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2a2a3e] text-xs group">
                  <span className="text-sm">{agent.avatar}</span>
                  <span className="truncate flex-1">{agent.name}</span>
                  <button
                    onClick={() => onRemoveAgent(agent.id)}
                    className="p-0.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
                    title="Remove agent"
                  >
                    <Trash size={10} />
                  </button>
                </div>
              ))}
              {agents.length === 0 && (
                <p className="text-[10px] text-gray-600 px-2">No agents assigned</p>
              )}
            </div>
            {selectedAgent !== undefined && (
              <select
                value={selectedAgent}
                onChange={(e) => { onAddAgent(e.target.value); setSelectedAgent(''); }}
                className="w-full mt-1 bg-[#0f0f1a] border border-[#2a2a3e] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500/50"
              >
                <option value="">Add agent...</option>
                {['coord', 'research', 'data', 'writer', 'review', 'knowledge'].map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag size={12} className="text-gray-500" />
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded text-[10px]"
                  style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color + '40' }}
                >
                  {tag.name}
                </span>
              ))}
              {tags.length === 0 && (
                <p className="text-[10px] text-gray-600">No tags defined</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceManager;

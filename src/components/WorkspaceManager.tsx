import React, { useState } from 'react';
import type { KBFile, KBFolder, A2AAgent, DocumentTag, WorkspaceProject } from '../types';
import { Plus, Trash, Folder, FileText, Users, Tag, Settings, BookOpen, Wrench, Database, Download, ChevronRight, ChevronDown } from './icons/lucide-shim';

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
  projects?: WorkspaceProject[];
}

const WORKSPACE_DIRS = [
  { id: 'inputs', name: '01_inputs', icon: '📥', desc: 'Raw inputs & datasets' },
  { id: 'agents', name: '02_agents', icon: '🤖', desc: 'Agent definitions' },
  { id: 'templates', name: '03_templates', icon: '📋', desc: 'Output templates' },
  { id: 'skills', name: '04_skills', icon: '⚡', desc: 'Custom skills' },
  { id: 'working', name: '05_working', icon: '📝', desc: 'Working memory' },
  { id: 'outputs', name: '06_outputs', icon: '📤', desc: 'Final outputs' },
  { id: 'memory', name: '07_memory', icon: '🧠', desc: 'Persistent memory' },
  { id: 'versions', name: '08_versions', icon: '🕒', desc: 'Version history' },
  { id: 'config', name: '09_config', icon: '⚙️', desc: 'Project configuration' },
];

const WorkspaceManager: React.FC<Props> = ({
  files, folders, agents, tags, activeProjectId,
  onSwitchProject, onCreateProject, onDeleteProject,
  onAddAgent, onRemoveAgent, projects: externalProjects,
}) => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['inputs', 'agents']));

  const projects: WorkspaceProject[] = externalProjects && externalProjects.length > 0 ? externalProjects : [
    {
      id: 'default',
      name: 'Default Workspace',
      description: 'Main working workspace',
      createdAt: new Date(),
      updatedAt: new Date(),
      fileCount: files.length,
      agentCount: agents.length,
      tags: [],
      agentIds: agents.map((a) => a.id),
    },
  ];

  const currentProject = projects.find((p) => p.id === activeProjectId);

  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    onCreateProject(projectName.trim());
    setProjectName('');
    setShowNewProject(false);
  };

  const toggleDir = (dirId: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dirId)) next.delete(dirId); else next.add(dirId);
      return next;
    });
  };

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder size={14} className="text-indigo-400" />
          <h2 className="text-xs font-semibold">Workspaces</h2>
        </div>
        <button onClick={() => setShowNewProject(!showNewProject)} className="p-1 rounded hover:bg-[#2a2a3e] text-gray-400" title="New Workspace"><Plus size={14} /></button>
      </div>

      {showNewProject && (
        <div className="flex gap-1">
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()} placeholder="Workspace name..." className="flex-1 bg-[#0f0f1a] border border-[#2a2a3e] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500/50" autoFocus />
          <button onClick={handleCreateProject} className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">Create</button>
        </div>
      )}

      {/* Project List */}
      <div className="space-y-1" role="list" aria-label="Workspace list">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
              activeProjectId === project.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-[#2a2a3e] border border-transparent'
            }`}
            onClick={() => onSwitchProject(project.id)}
            role="listitem"
          >
            <Folder size={14} className="text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium truncate block">{project.name}</span>
              <span className="text-[10px] text-gray-500">{project.fileCount || files.length} files · {project.agentCount || agents.length} agents</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }} className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400" title="Delete workspace"><Trash size={12} /></button>
          </div>
        ))}
      </div>

      {/* Active Project Directory Tree */}
      {activeProjectId && currentProject && (
        <div className="space-y-3 pt-3 border-t border-[#2a2a3e]">
          <div className="flex items-center gap-2 mb-1">
            <Database size={12} className="text-gray-500" />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Project Structure</span>
          </div>
          <div className="space-y-0.5">
            {WORKSPACE_DIRS.map((dir) => {
              const isExpanded = expandedDirs.has(dir.id);
              const dirFiles = files.filter((f) => f.parentFolderId === `${activeProjectId}-${dir.id}`);
              return (
                <div key={dir.id}>
                  <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#2a2a3e] text-xs cursor-pointer"
                    onClick={() => toggleDir(dir.id)}
                  >
                    {isExpanded ? <ChevronDown size={10} className="text-gray-500" /> : <ChevronRight size={10} className="text-gray-500" />}
                    <span className="text-xs">{dir.icon}</span>
                    <span className="text-xs font-medium">{dir.name}</span>
                    <span className="text-[9px] text-gray-500 ml-1">{dir.desc}</span>
                    <span className="text-[9px] text-gray-600 ml-auto">{dirFiles.length}</span>
                  </div>
                  {isExpanded && (
                    <div className="ml-5 space-y-0.5">
                      {dirFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-[#2a2a3e] text-[10px]">
                          <FileText size={10} className="text-gray-500 shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                      ))}
                      {dirFiles.length === 0 && <p className="text-[9px] text-gray-600 px-2 py-0.5 italic">Empty</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#2a2a3e] pt-3 space-y-3">
            {/* Files summary */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={12} className="text-gray-500" />
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Files ({files.length})</span>
              </div>
              <div className="space-y-1">
                {files.slice(0, 5).map((file) => (
                  <div key={file.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2a2a3e] text-xs">
                    <FileText size={12} className="text-gray-500 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
                {files.length > 5 && <p className="text-[10px] text-gray-500 px-2">+{files.length - 5} more files</p>}
                {files.length === 0 && <p className="text-[10px] text-gray-600 px-2">No files yet</p>}
              </div>
            </div>

            {/* Agents in workspace */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users size={12} className="text-gray-500" />
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Agents ({agents.length})</span>
              </div>
              <div className="space-y-1">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2a2a3e] text-xs group">
                    <span className="text-sm">{agent.avatar}</span>
                    <span className="truncate flex-1">{agent.name}</span>
                    {agent.skills && agent.skills.length > 0 && <BookOpen size={10} className="text-indigo-400" />}
                    {agent.tools && agent.tools.length > 0 && <Wrench size={10} className="text-green-400" />}
                    <button onClick={() => onRemoveAgent(agent.id)} className="p-0.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100" title="Remove agent"><Trash size={10} /></button>
                  </div>
                ))}
                {agents.length === 0 && <p className="text-[10px] text-gray-600 px-2">No agents</p>}
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag size={12} className="text-gray-500" />
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Tags</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span key={tag.id} className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color + '40' }}>{tag.name}</span>
                ))}
                {tags.length === 0 && <p className="text-[10px] text-gray-600">No tags defined</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceManager;

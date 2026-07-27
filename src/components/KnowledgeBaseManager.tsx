/**
 * KnowledgeBaseManager — File/folder management with drag-and-drop, search, and bulk actions.
 * @license SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useCallback, useRef } from 'react';
import { KBFile, KBFolder, FileType } from '../types';
import { Folder, FileText, Plus, Trash, Upload, Search, Download, Tag } from './icons/lucide-shim';
import { getCSVSummary } from '../services/csvService';

interface Props {
  files: KBFile[];
  folders: KBFolder[];
  setFiles: React.Dispatch<React.SetStateAction<KBFile[]>>;
  setFolders: React.Dispatch<React.SetStateAction<KBFolder[]>>;
  onFileSelect: (file: KBFile) => void;
  activeFileId: string | null;
}

const KnowledgeBaseManager: React.FC<Props> = ({ files, folders, setFiles, setFolders, onFileSelect, activeFileId }) => {
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(folders.map((f) => f.id)));
  const [csvPreview, setCsvPreview] = useState<{ fileId: string; headers: string[]; columnTypes: string[]; rowCount: number; preview: string[][] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const detectFileType = (name: string): FileType => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!ext) return 'text';
    const typeMap: Record<string, FileType> = {
      txt: 'text', md: 'markdown', json: 'json', csv: 'csv',
      pdf: 'pdf', doc: 'doc', docx: 'doc',
      xls: 'sheet', xlsx: 'sheet',
      ppt: 'slides', pptx: 'slides',
      png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image',
    };
    return typeMap[ext] || 'text';
  };

  const readFileAsText = (df: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error(`Failed to read ${df.name}`));
      reader.readAsText(df);
    });

  const readFileAsDataURL = (df: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error(`Failed to read ${df.name}`));
      reader.readAsDataURL(df);
    });

  const addFile = useCallback((df: File, folderId: string | null = null, notify?: () => void) => {
    const type = detectFileType(df.name);
    if (type === 'image') {
      readFileAsDataURL(df).then((content) => {
        const newFile: KBFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: df.name, type, content,
          size: `${(df.size / 1024).toFixed(1)} KB`,
          parentFolderId: folderId, isActive: false, createdAt: new Date(),
        };
        setFiles((prev) => [newFile, ...prev]);
        notify?.();
      }).catch(() => {});
    } else {
      readFileAsText(df).then((content) => {
        const newFile: KBFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: df.name, type, content: type === 'pdf' ? content.slice(0, 100000) : content,
          size: `${(df.size / 1024).toFixed(1)} KB`,
          parentFolderId: folderId, isActive: false, createdAt: new Date(),
        };
        if (type === 'pdf' && df.size > 102400) {
          newFile.url = URL.createObjectURL(df);
        }
        setFiles((prev) => [newFile, ...prev]);
        notify?.();
      }).catch(() => {});
    }
  }, [setFiles]);

  const handleFilePicker = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = Array.from(e.target.files || []);
    for (const f of pickedFiles) {
      if (f.size > MAX_FILE_SIZE) continue;
      addFile(f);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [addFile]);

  // Filter files by search
  const filteredFiles = searchQuery
    ? files.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  const filesByFolder = (folderId: string | null) =>
    filteredFiles.filter((f) => f.parentFolderId === folderId);

  const unsortedFiles = filesByFolder(null);

  // Create folder
  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const folder: KBFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
    };
    setFolders((prev) => [...prev, folder]);
    setNewFolderName('');
    setShowNewFolder(false);
    setExpandedFolders((prev) => new Set([...prev, folder.id]));
  };

  // Create new file
  const createFile = (folderId: string | null = null) => {
    const name = newFileName.trim() || `New File ${files.length + 1}.md`;
    const file: KBFile = {
      id: `file-${Date.now()}`,
      name: name.endsWith('.md') ? name : name + '.md',
      type: 'markdown',
      content: `# ${name.replace(/\.md$/, '')}\n\n`,
      size: '0.1 KB',
      parentFolderId: folderId,
      isActive: false,
      createdAt: new Date(),
    };
    setFiles((prev) => [file, ...prev]);
    setNewFileName('');
    setShowNewFile(false);
    onFileSelect(file);
  };

  // Delete file
  const deleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Toggle active (context inclusion)
  const toggleActive = (fileId: string) => {
    setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, isActive: !f.isActive } : f));
  };

  // Delete folder
  const deleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setFiles((prev) => prev.map((f) => f.parentFolderId === folderId ? { ...f, parentFolderId: null } : f));
  };

  // Toggle folder expand
  const toggleExpand = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  // Drag-and-drop file upload
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    for (const df of droppedFiles) {
      if (df.size > MAX_FILE_SIZE) continue;
      addFile(df);
    }
  }, [addFile]);

  // Export file
  const exportFile = (file: KBFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="px-3 py-2 border-b border-[var(--border)]">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg pl-7 pr-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50 placeholder-gray-500"
            aria-label="Search files"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border)]">
        <button onClick={() => setShowNewFolder(!showNewFolder)} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="New folder" aria-label="New folder" aria-expanded={showNewFolder}>
          <Folder size={14} className="text-[var(--text-secondary)]" />
        </button>
        <button onClick={() => setShowNewFile(!showNewFile)} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="New file" aria-label="New file" aria-expanded={showNewFile}>
          <Plus size={14} className="text-[var(--text-secondary)]" />
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Upload file (PDF, image, doc)" aria-label="Upload file">
          <Upload size={14} className="text-[var(--text-secondary)]" />
        </button>
        <input ref={fileInputRef} type="file" multiple accept=".txt,.md,.json,.csv,.pdf,.png,.jpg,.jpeg,.gif,.webp,.svg,.doc,.docx,.xls,.xlsx,.ppt,.pptx" className="hidden" onChange={handleFilePicker} aria-label="File picker" />
      </div>

      {/* New folder input */}
      {showNewFolder && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createFolder()}
            placeholder="Folder name..."
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-xs focus:outline-none focus:border-[var(--accent)]/50"
            autoFocus
          />
          <button onClick={createFolder} className="px-2 py-1 text-xs bg-[var(--accent)] rounded text-white" aria-label="Create folder">Create</button>
        </div>
      )}

      {/* New file input */}
      {showNewFile && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createFile()}
            placeholder="filename.md"
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-xs focus:outline-none focus:border-[var(--accent)]/50"
            autoFocus
          />
          <button onClick={() => createFile()} className="px-2 py-1 text-xs bg-[var(--accent)] rounded text-white" aria-label="Create file">Create</button>
        </div>
      )}

      {/* File tree — drop zone */}
      <div
        className={`flex-1 overflow-y-auto px-2 py-2 drop-zone ${dragOver ? 'dragover' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="tree"
        aria-label="File tree"
      >
        {/* Unsorted files */}
        {unsortedFiles.length > 0 && (
          <div className="mb-2">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Unsorted</div>
            {unsortedFiles.map((file) => (
              <FileRow key={file.id} file={file} isActive={activeFileId === file.id} onSelect={onFileSelect} onDelete={deleteFile} onToggleActive={toggleActive} onExport={exportFile} onCsvPreview={(f) => { try { setCsvPreview({ fileId: f.id, ...getCSVSummary(f.content) }); } catch {} }} />
            ))}
          </div>
        )}

        {/* Folders */}
        {folders.map((folder) => {
          const folderFiles = filesByFolder(folder.id);
          const isExpanded = expandedFolders.has(folder.id);
          return (
            <div key={folder.id} className="mb-1">
              <div className="flex items-center gap-1 px-1 py-1 hover:bg-[var(--bg-hover)] rounded cursor-pointer" onClick={() => toggleExpand(folder.id)} role="treeitem" aria-expanded={isExpanded}>
                <span className="text-[10px] text-[var(--text-muted)]">{isExpanded ? '▼' : '▶'}</span>
                <Folder size={12} className="text-yellow-500" />
                <span className="text-xs flex-1 truncate">{folder.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{folderFiles.length}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }} className="p-0.5 hover:text-red-400" aria-label={`Delete folder ${folder.name}`}><Trash size={10} /></button>
              </div>
              {isExpanded && (
                <div className="ml-4">
                  {folderFiles.map((file) => (
                    <FileRow key={file.id} file={file} isActive={activeFileId === file.id} onSelect={onFileSelect} onDelete={deleteFile} onToggleActive={toggleActive} onExport={exportFile} onCsvPreview={(f) => { try { setCsvPreview({ fileId: f.id, ...getCSVSummary(f.content) }); } catch {} }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {files.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <Upload size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">Drop files here or create new ones</p>
          </div>
        )}
      </div>

      {/* CSV Preview Popover */}
      {csvPreview && (
        <div className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center p-4" onClick={() => setCsvPreview(null)}>
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <span className="text-sm font-medium">CSV Preview — {csvPreview.rowCount} rows, {csvPreview.headers.length} columns</span>
              <button onClick={() => setCsvPreview(null)} className="p-1 rounded hover:bg-[var(--bg-hover)]" aria-label="Close preview">✕</button>
            </div>
            <div className="overflow-auto max-h-[60vh]">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-secondary)]">
                    {csvPreview.headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 text-left font-medium border-b border-[var(--border)] whitespace-nowrap">
                        {h}
                        <span className="ml-1 text-[10px] text-[var(--text-muted)]">({csvPreview.columnTypes[i]})</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvPreview.preview.map((row, ri) => (
                    <tr key={ri} className="hover:bg-[var(--bg-hover)]">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-1.5 border-b border-[var(--border)] truncate max-w-[200px]">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]">
              Showing first {csvPreview.preview.length} of {csvPreview.rowCount} rows
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-3 py-1.5 border-t border-[var(--border)] flex justify-between text-[10px] text-[var(--text-muted)]">
        <span>{files.length} files</span>
        <span>{folders.length} folders</span>
        <span>{files.filter((f) => f.isActive).length} active</span>
      </div>
    </div>
  );
};

/* ─── File Row Sub-component ─── */
const FileRow: React.FC<{
  file: KBFile;
  isActive: boolean;
  onSelect: (f: KBFile) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onExport: (f: KBFile) => void;
  onCsvPreview?: (f: KBFile) => void;
}> = ({ file, isActive, onSelect, onDelete, onToggleActive, onExport, onCsvPreview }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer group ${isActive ? 'bg-[var(--accent-subtler)] border-l-2 border-[var(--accent)]' : 'hover:bg-[var(--bg-hover)]'}`} role="treeitem" aria-selected={isActive}>
    <input type="checkbox" checked={file.isActive} onChange={() => onToggleActive(file.id)} className="w-3 h-3 accent-[var(--accent)]" title="Include in AI context" aria-label={`Include ${file.name} in AI context`} />
    <FileText size={12} className="text-[var(--text-secondary)] shrink-0" />
    <span className="text-xs flex-1 truncate" onClick={() => onSelect(file)}>{file.name}</span>
    {file.type === 'csv' && onCsvPreview && (
      <button onClick={(e) => { e.stopPropagation(); onCsvPreview(file); }} className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-green-400" title="Preview table" aria-label={`Preview ${file.name} as table`}>
        <Tag size={10} />
      </button>
    )}
    <button onClick={(e) => { e.stopPropagation(); onExport(file); }} className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-[var(--accent)]" title="Export" aria-label={`Export ${file.name}`}><Download size={10} /></button>
    <button onClick={(e) => { e.stopPropagation(); onDelete(file.id); }} className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-red-400" title="Delete" aria-label={`Delete ${file.name}`}><Trash size={10} /></button>
  </div>
);

export default KnowledgeBaseManager;

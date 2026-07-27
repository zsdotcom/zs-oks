import { useState, useEffect, useCallback, useRef } from 'react';
import { KBFile, KBFolder, DocumentVersion } from '../types';
import { dbGetAll, dbPut } from '../db/indexedDB';
import { initCollaboration, destroyCollaboration, broadcastFileUpdate, updatePresence, onCollabAction, getActivePeers } from '../services/collaborationService';
import { initSyncQueue, destroySyncQueue } from '../services/syncQueue';
import type { CollabPresence, CollabAction } from '../services/collaborationService';

export function useFiles() {
  const [files, setFiles] = useState<KBFile[]>([]);
  const [folders, setFolders] = useState<KBFolder[]>([]);
  const [activeFile, setActiveFile] = useState<KBFile | null>(null);
  const [documentVersions, setDocumentVersions] = useState<DocumentVersion[]>([]);
  const [collabPeers, setCollabPeers] = useState<CollabPresence[]>([]);
  const collabActionsRef = useRef<CollabAction[]>([]);
  const filesRef = useRef<KBFile[]>([]);

  useEffect(() => {
    Promise.all([
      dbGetAll<KBFile>('files'),
      dbGetAll<KBFolder>('folders'),
    ]).then(([loadedFiles, loadedFolders]) => {
      if (loadedFiles.length > 0) { setFiles(loadedFiles); filesRef.current = loadedFiles; }
      if (loadedFolders.length > 0) setFolders(loadedFolders);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    initCollaboration();
    initSyncQueue();
    const unsub = onCollabAction((action) => {
      collabActionsRef.current.push(action);
      if (collabActionsRef.current.length > 100) collabActionsRef.current = collabActionsRef.current.slice(-50);
      if (action.type === 'file-update') {
        const { fileId, content, fileName } = action.payload;
        setFiles((prev) => prev.map((f) =>
          f.id === fileId ? { ...f, content, name: fileName } : f
        ));
        setActiveFile((prev) => {
          if (!prev || prev.id !== fileId) return prev;
          return { ...prev, content, name: fileName };
        });
        const currentFiles = filesRef.current;
        const existing = currentFiles.find(f => f.id === fileId);
        dbPut('files', existing ? { ...existing, content, name: fileName } : { id: fileId, content, name: fileName, type: 'markdown', size: `${(content.length / 1024).toFixed(1)} KB`, isActive: false, createdAt: new Date() }).catch(() => {});
      }
      const peers = getActivePeers(collabActionsRef.current);
      setCollabPeers(peers);
    });
    return () => {
      unsub();
      destroySyncQueue();
      destroyCollaboration();
    };
  }, []);

  const handleFileSelect = useCallback((file: KBFile) => {
    setActiveFile(file);
    updatePresence(file.id);
  }, []);

  const handleSaveFile = useCallback((updatedFile: KBFile) => {
    setFiles((prev) => prev.map((f) => f.id === updatedFile.id ? updatedFile : f));
    if (activeFile?.id === updatedFile.id) setActiveFile(updatedFile);
    dbPut('files', updatedFile).catch(() => {});
    broadcastFileUpdate(updatedFile.id, updatedFile.content, updatedFile.name);
    updatePresence(updatedFile.id);
  }, [activeFile]);

  const handleSaveVersion = useCallback((docId: string, content: string, label?: string) => {
    const version: DocumentVersion = {
      id: `v-${Date.now()}`,
      documentId: docId,
      content,
      createdAt: new Date(),
      size: `${(content.length / 1024).toFixed(1)} KB`,
      label,
    };
    setDocumentVersions((prev) => [...prev, version]);
    dbPut('versions', version).catch(() => {});
  }, []);

  return {
    files, setFiles, folders, setFolders,
    activeFile, setActiveFile,
    documentVersions, setDocumentVersions,
    collabPeers, setCollabPeers,
    handleFileSelect, handleSaveFile, handleSaveVersion,
  };
}

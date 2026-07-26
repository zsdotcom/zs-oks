import { useState, useEffect, useCallback } from 'react';
import { KBFile, KBFolder, DocumentVersion } from '../types';
import { dbGetAll, dbPut } from '../db/indexedDB';

export function useFiles() {
  const [files, setFiles] = useState<KBFile[]>([]);
  const [folders, setFolders] = useState<KBFolder[]>([]);
  const [activeFile, setActiveFile] = useState<KBFile | null>(null);
  const [documentVersions, setDocumentVersions] = useState<DocumentVersion[]>([]);

  useEffect(() => {
    Promise.all([
      dbGetAll<KBFile>('files'),
      dbGetAll<KBFolder>('folders'),
    ]).then(([loadedFiles, loadedFolders]) => {
      if (loadedFiles.length > 0) setFiles(loadedFiles);
      if (loadedFolders.length > 0) setFolders(loadedFolders);
    }).catch(() => {});
  }, []);

  const handleFileSelect = useCallback((file: KBFile) => {
    setActiveFile(file);
  }, []);

  const handleSaveFile = useCallback((updatedFile: KBFile) => {
    setFiles((prev) => prev.map((f) => f.id === updatedFile.id ? updatedFile : f));
    if (activeFile?.id === updatedFile.id) setActiveFile(updatedFile);
    dbPut('files', updatedFile).catch(() => {});
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
    handleFileSelect, handleSaveFile, handleSaveVersion,
  };
}

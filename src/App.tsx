import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  ChatMessage, MessageSender, KBFile, KBFolder, URLGroup,
  ProviderConfig, SavedPrompt, A2AAgent, A2AMetric, SandboxSettings,
  DocumentVersion, KanbanBoard, DocumentTemplate, DocumentTag,
  AppView, AppUser, TaskColumn, TaskCard, MCPServer, MCPTool,
} from './types';
import { queryLLM, getInitialSuggestions, runA2ADebate, runOrchestratedWorkflow, runSequentialWorkflow } from './services/geminiService';
import { signInWithGoogle, logoutUser, subscribeAuth, updateUserDoc } from './services/googleAuthService';
import { dbGetAll, dbPut, dbDelete, dbGetKey, dbSetKey, migrateLocalStorage, exportAllData, importAllData } from './db/indexedDB';
import { useFiles } from './hooks/useFiles';
import { useChat } from './hooks/useChat';
import { usePWAInstall } from './hooks/usePWAInstall';
import { fireWebhooks, getAllWebhooks, addWebhook, removeWebhook as removeWebhookSvc, updateWebhook as updateWebhookSvc } from './services/webhookService';
import type { WebhookConfig } from './services/webhookService';
import KnowledgeBaseManager from './components/KnowledgeBaseManager';
import ChatInterface from './components/ChatInterface';
import ThemeSwitcher from './components/ThemeSwitcher';
import { AgentBuilder } from './components/AgentBuilder';
import SearchPanel from './components/SearchPanel';
import WorkspaceManager from './components/WorkspaceManager';
import { KanbanBoardView } from './components/KanbanBoardView';
import { ChatSessionSidebar } from './components/ChatSessionSidebar';
import { GmailCompose } from './components/GmailCompose';
import { ErrorBoundary } from './components/ErrorBoundary';

const WorkspaceDocumentEditor = React.lazy(() => import('./components/WorkspaceDocumentEditor').then(m => ({ default: m.WorkspaceDocumentEditor })));
const A2AMetricsDashboard = React.lazy(() => import('./components/A2AMetricsDashboard').then(m => ({ default: m.A2AMetricsDashboard })));
const GoogleWorkspacePanel = React.lazy(() => import('./components/GoogleWorkspacePanel').then(m => ({ default: m.GoogleWorkspacePanel })));
const SettingsPanel = React.lazy(() => import('./components/SettingsPanel'));
const MCPServerPanel = React.lazy(() => import('./components/MCPServerPanel').then(m => ({ default: m.MCPServerPanel })));
import { ICD11Lookup } from './components/ICD11Lookup';
import { EpiMap } from './components/EpiMap';
import type { EpiDataPoint } from './components/EpiMap';
import {
  Sparkles, Brain, Code, ShieldCheck, Database, GitMerge, Activity, BarChart,
  Edit, BookOpen, X, Search, MessageSquare, Settings, Folder, FileText,
  Moon, Sun, Cloud, Wifi, WifiOff, Layout, Menu, Clock, Users, Zap,
  Globe, Layers, Template, Kanban, Plus, Trash, Mail,
  Target, Book, BarChart3, FileEdit, SearchCheck, Library, MapPin,
  Download,
} from './components/icons/lucide-shim';

const INITIAL_FOLDERS: KBFolder[] = [
  { id: 'dev-guidelines', name: 'Development Guidelines' },
  { id: 'market-research', name: 'Market Intelligence' },
  { id: 'health-reports', name: 'Health & Epidemiology' },
  { id: 'templates', name: 'Templates' },
];

const INITIAL_FILES: KBFile[] = [
  {
    id: 'coding-standards', name: 'Coding Standards.md', type: 'markdown',
    content: `# Coding Standards & Guidelines\n\n1. **TypeScript First**: All components and helpers must be typed strictly.\n2. **React Hooks**: Prefer hooks and state separation.\n3. **Tailwind Styling**: Stick to clean, modular utilities and responsive borders.\n4. **Zero Dependencies**: No npm packages beyond react + react-dom.`,
    size: '0.8 KB', parentFolderId: 'dev-guidelines', isActive: true, createdAt: new Date(),
  },
  {
    id: 'architecture-map', name: 'Architecture Map.json', type: 'json',
    content: JSON.stringify({ appName: 'Open Knowledge Studio', aiEngine: 'Gemini 3.5 Flash', infrastructure: 'IndexedDB + Google Drive', security: 'Google Sign-In Auth' }, null, 2),
    size: '0.4 KB', parentFolderId: 'dev-guidelines', isActive: true, createdAt: new Date(),
  },
  {
    id: 'epi-report-template', name: 'WHO Field Report.md', type: 'markdown',
    content: `# WHO FIELD EPIDEMIOLOGY REPORT\n\n## 1. Demographic Overview\n- **Officer**: Field Unit\n- **Location**: District\n- **Date**: ${new Date().toISOString().split('T')[0]}\n\n## 2. Incident Summary\n| Metric | Value |\n|---|---|\n| Total Cases | 0 |\n| Active Cases | 0 |\n| Recovered | 0 |\n| Fatalities | 0 |\n\n## 3. SIR Model Parameters\n$$R_0 = \\frac{\\beta}{\\gamma}$$\n\n## 4. Action Items\n- [ ] Establish surveillance zone\n- [ ] Deploy rapid response team\n- [ ] Verify supply chain integrity`,
    size: '1.2 KB', parentFolderId: 'health-reports', isActive: true, createdAt: new Date(),
  },
  {
    id: 'revenue-data', name: 'Quarterly Projections.csv', type: 'csv',
    content: `Quarter,Revenue,GrowthRate,DirectCosts\nQ1-2026,245000,12%,82000\nQ2-2026,290000,18%,95000\nQ3-2026,345000,19%,112000\nQ4-2026,420000,22%,135000`,
    size: '0.5 KB', parentFolderId: 'market-research', isActive: false, createdAt: new Date(),
  },
];

const INITIAL_PROVIDER_CONFIG: ProviderConfig = {
  provider: 'gemini', apiKey: '', selectedModel: 'gemini-3.5-flash',
  temperature: 0.7, enableThinking: false, thinkingLevel: 'low',
  enableSearchGrounding: false, enableMapsGrounding: false,
};

const INITIAL_TEMPLATES: DocumentTemplate[] = [
  { id: 't1', name: 'WHO Epidemiology Report', description: 'Field epidemiology report template with SIR modeling', category: 'epidemiology', content: '# WHO FIELD REPORT\n\n## Overview\n## Incident Matrix\n## SIR Model\n## Action Items' },
  { id: 't2', name: 'System Architecture Diagram', description: 'Mermaid sequence diagram for system design', category: 'mermaid', content: '```mermaid\nsequenceDiagram\n  Client->>Server: Request\n  Server->>DB: Query\n  DB-->>Server: Data\n  Server-->>Client: Response\n```' },
  { id: 't3', name: 'Mathematical Reference', description: 'Common statistical formulas with KaTeX', category: 'math', content: '## Normal Distribution\n$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$\n\n## Standard Error\n$$SE = \\frac{\\sigma}{\\sqrt{n}}$$' },
  { id: 't4', name: 'Research Paper Draft', description: 'Academic paper structure template', category: 'research', content: '# Research Paper\n\n## Abstract\n\n## 1. Introduction\n\n## 2. Methodology\n\n## 3. Results\n\n## 4. Discussion\n\n## 5. Conclusion\n\n## References' },
];

const INITIAL_URL_GROUPS: URLGroup[] = [
  { id: 'gemini-overview', name: 'Gemini Docs Overview', urls: ['https://ai.google.dev/gemini-api/docs', 'https://ai.google.dev/gemini-api/docs/models', 'https://ai.google.dev/gemini-api/docs/api-key'] },
  { id: 'model-capabilities', name: 'Model Capabilities', urls: ['https://ai.google.dev/gemini-api/docs/text-generation', 'https://ai.google.dev/gemini-api/docs/structured-output', 'https://ai.google.dev/gemini-api/docs/thinking'] },
];

const DEFAULT_A2A_AGENTS: A2AAgent[] = [
  { id: 'coord', name: 'Coordinator', role: 'Orchestrates workflows and delegates tasks', avatar: '🎯', systemPrompt: `You are the Coordinator Agent of Open Knowledge Studio. Your role is to receive user requests and analyze their complexity. If the task is simple, handle it directly. If the task is complex, decompose it into sub-tasks and delegate to the appropriate specialized agents. Monitor progress and validate outputs before presenting to the user.`, color: '#8B5CF6', isActive: true },
  { id: 'research', name: 'Researcher', role: 'Searches and synthesizes information', avatar: '🔬', systemPrompt: `You are the Research Agent of Open Knowledge Studio. Your role is to identify research queries, synthesize findings from available information, and generate structured summaries with proper citations. Tag all findings with confidence levels.`, color: '#06B6D4', isActive: true },
  { id: 'data', name: 'Data Analyst', role: 'Processes data and generates statistics', avatar: '📊', systemPrompt: `You are the Data Analyst Agent of Open Knowledge Studio. Your role is to process datasets, perform statistical analysis, generate visualizations, and compute metrics. Always sanitize inputs, handle missing data gracefully, and provide confidence intervals. When presenting data, generate diagrams using Mermaid syntax (flowcharts, bar charts, pie charts, xy charts) inside \`\`\`mermaid code fences. Use KaTeX $$inline math$$ for statistical formulas.`, color: '#F59E0B', isActive: true },
  { id: 'writer', name: 'Writer', role: 'Drafts documents and formats outputs', avatar: '✍️', systemPrompt: `You are the Writer Agent of Open Knowledge Studio. Your role is to draft documents from structured data, apply templates, format outputs, and maintain consistent formatting. Ensure all claims are backed by evidence.`, color: '#10B981', isActive: true },
  { id: 'review', name: 'Reviewer', role: 'Quality checks and peer review', avatar: '🔍', systemPrompt: `You are the Reviewer Agent of Open Knowledge Studio. Your role is to perform quality checks, audit citations, validate compliance, and identify contradictory claims. Be specific and constructive in feedback.`, color: '#EF4444', isActive: true },
  { id: 'librarian', name: 'Librarian', role: 'Maintains memory and manages knowledge', avatar: '📚', systemPrompt: `You are the Librarian Agent of Open Knowledge Studio. Your role is to maintain memory, organize knowledge, manage references, and ensure information is properly indexed and retrievable.`, color: '#8B5CF6', isActive: true },
];

const INITIAL_SAVED_PROMPTS: SavedPrompt[] = [
  { id: 'p1', title: 'Coordinator Agent', description: 'Orchestrates workflows and delegates tasks', content: 'You are the Coordinator Agent of Open Knowledge Studio. Your role is to receive user requests and analyze their complexity. If the task is simple, handle it directly. If the task is complex, decompose it into sub-tasks and delegate to the appropriate specialized agents. Monitor progress and validate outputs before presenting to the user.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p2', title: 'Researcher Agent', description: 'Searches and synthesizes information', content: 'You are the Research Agent of Open Knowledge Studio. Your role is to identify research queries, synthesize findings from available information, and generate structured summaries with proper citations. Tag all findings with confidence levels.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p3', title: 'Data Analyst Agent', description: 'Processes data and generates statistics', content: 'You are the Data Analyst Agent of Open Knowledge Studio. Your role is to process datasets, perform statistical analysis, generate visualizations, and compute metrics. Always sanitize inputs, handle missing data gracefully, and provide confidence intervals. When presenting data, generate diagrams using Mermaid syntax (flowcharts, bar charts, pie charts, xy charts) inside ```mermaid code fences. Use KaTeX $$inline math$$ for statistical formulas.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p4', title: 'Writer Agent', description: 'Drafts documents and formats outputs', content: 'You are the Writer Agent of Open Knowledge Studio. Your role is to draft documents from structured data, apply templates, format outputs, and maintain consistent formatting. Ensure all claims are backed by evidence.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p5', title: 'Reviewer Agent', description: 'Quality checks and peer review', content: 'You are the Reviewer Agent of Open Knowledge Studio. Your role is to perform quality checks, audit citations, validate compliance, and identify contradictory claims. Be specific and constructive in feedback.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
  { id: 'p6', title: 'Librarian Agent', description: 'Maintains memory and manages knowledge', content: 'You are the Librarian Agent of Open Knowledge Studio. Your role is to maintain memory, organize knowledge, manage references, and ensure information is properly indexed and retrievable.', category: 'A2A Workflow', createdAt: new Date().toISOString() },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('dark');
  const [accentColor, setAccentColor] = useState<string>('#8B5CF6');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showChatSessions, setShowChatSessions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGooglePanel, setShowGooglePanel] = useState(false);
  const [showGmailCompose, setShowGmailCompose] = useState(false);
  const [showICD11, setShowICD11] = useState(false);
  const [showEpiMap, setShowEpiMap] = useState(false);
  const [epiDataPoints] = useState<EpiDataPoint[]>([
    { id: 'epi-1', lat: -1.286, lng: 36.817, label: 'Nairobi', disease: 'Malaria', cases: 1240, severity: 'high', date: '2026-06-15', status: 'active' },
    { id: 'epi-2', lat: 6.524, lng: 3.379, label: 'Lagos', disease: 'Dengue fever', cases: 890, severity: 'medium', date: '2026-06-14', status: 'active' },
    { id: 'epi-3', lat: 28.613, lng: 77.209, label: 'Delhi', disease: 'COVID-19', cases: 3200, severity: 'critical', date: '2026-06-15', status: 'active' },
    { id: 'epi-4', lat: -23.550, lng: -46.633, label: 'São Paulo', disease: 'Dengue fever', cases: 2100, severity: 'high', date: '2026-06-14', status: 'active' },
    { id: 'epi-5', lat: 40.712, lng: -74.006, label: 'New York', disease: 'Influenza', cases: 560, severity: 'low', date: '2026-06-10', status: 'contained' },
    { id: 'epi-6', lat: 48.856, lng: 2.352, label: 'Paris', disease: 'Measles', cases: 340, severity: 'medium', date: '2026-06-08', status: 'contained' },
    { id: 'epi-7', lat: 35.676, lng: 139.650, label: 'Tokyo', disease: 'COVID-19', cases: 780, severity: 'medium', date: '2026-06-07', status: 'active' },
    { id: 'epi-8', lat: -33.868, lng: 151.209, label: 'Sydney', disease: 'Influenza', cases: 190, severity: 'low', date: '2026-06-05', status: 'resolved' },
  ]);

  const epiTimelineData = useMemo(() => {
    const dates = [...new Set(epiDataPoints.map(p => p.date))].sort();
    return dates.map(date => ({
      date,
      activePoints: epiDataPoints.filter(p => p.date === date).map(p => p.id),
    }));
  }, [epiDataPoints]);

  const handleEpiTimeChange = useCallback((date: string) => {
    console.log('EpiMap timeline date:', date);
  }, []);

  const {
    files, setFiles, folders, setFolders,
    activeFile, setActiveFile,
    documentVersions, setDocumentVersions,
    handleFileSelect, handleSaveFile,
  } = useFiles();

  const [providerConfig, setProviderConfig] = useState<ProviderConfig>(INITIAL_PROVIDER_CONFIG);
  const {
    sessions, activeSessionId, messages,
    isLoading, setIsLoading,
    isFetchingSuggestions, setIsFetchingSuggestions,
    initialSuggestions, setInitialSuggestions,
    switchSession, createSession, deleteSession,
    setMessages,
  } = useChat(providerConfig);

  const [a2aAgents, setA2aAgents] = useState<A2AAgent[]>(DEFAULT_A2A_AGENTS);
  const [a2aMetrics, setA2aMetrics] = useState<A2AMetric[]>([]);
  const [isA2ALoading, setIsA2ALoading] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('chat');
  const [templates] = useState<DocumentTemplate[]>(INITIAL_TEMPLATES);
  const [tags] = useState<DocumentTag[]>([
    { id: 'tag-1', name: 'epidemiology', color: '#ef4444' },
    { id: 'tag-2', name: 'architecture', color: '#3b82f6' },
    { id: 'tag-3', name: 'research', color: '#10b981' },
  ]);
  const [urlGroups] = useState<URLGroup[]>(INITIAL_URL_GROUPS);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(INITIAL_SAVED_PROMPTS);
  const [sandboxSettings, setSandboxSettings] = useState<SandboxSettings>({ strictSandbox: true, allowedOutbound: true, showAuditLedger: false });
  const [activeProjectId, setActiveProjectId] = useState<string>('default');
  const [showComposeEmail, setShowComposeEmail] = useState(false);

  // Kanban state
  const [kanbanBoards, setKanbanBoards] = useState<KanbanBoard[]>([
    { id: 'board-1', title: 'Project Tasks', columns: [
      { id: 'col-todo', title: 'To Do', color: '#3B82F6', order: 0 },
      { id: 'col-progress', title: 'In Progress', color: '#F59E0B', order: 1 },
      { id: 'col-done', title: 'Done', color: '#10B981', order: 2 },
    ], cards: [] },
  ]);
  const [activeBoardId, setActiveBoardId] = useState('board-1');
  const { isInstallable, promptInstall } = usePWAInstall();

  // MCP state
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);

  // Agent builder & webhook state
  const [showAgentBuilder, setShowAgentBuilder] = useState(false);
  const [editingAgent, setEditingAgent] = useState<A2AAgent | undefined>();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);

  useEffect(() => {
    migrateLocalStorage();
    dbGetAll<A2AAgent>('a2aAgents').then((loaded) => {
      if (loaded.length > 0) setA2aAgents(loaded);
    }).catch(() => {});
    dbGetAll<KanbanBoard>('kanban').then((loaded) => {
      if (loaded.length > 0) { setKanbanBoards(loaded); setActiveBoardId(loaded[0].id); }
    }).catch(() => {});
    dbGetAll<MCPServer>('sandbox').then((loaded) => {
      if (loaded.length > 0) setMcpServers(loaded);
    }).catch(() => {});
    dbGetKey('ui-theme').then((v) => { if (v) setSelectedTheme(v); }).catch(() => {});
    dbGetKey('ui-accent').then((v) => { if (v) setAccentColor(v); }).catch(() => {});
    setWebhooks(getAllWebhooks());
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { a2aAgents.forEach((a) => dbPut('a2aAgents', a).catch(() => {})); }, 100);
    return () => clearTimeout(t);
  }, [a2aAgents]);

  useEffect(() => {
    const t = setTimeout(() => { kanbanBoards.forEach((b) => dbPut('kanban', { id: `kb-${b.id}`, boards: JSON.stringify(b) }).catch(() => {})); }, 100);
    return () => clearTimeout(t);
  }, [kanbanBoards]);

  useEffect(() => {
    const unsub = subscribeAuth((u) => setCurrentUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      updateUserDoc({
        files: JSON.parse(JSON.stringify(files)),
        folders: JSON.parse(JSON.stringify(folders)),
        providerConfig,
        savedPrompts,
        lastSync: new Date().toISOString(),
      }).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser, files, folders, providerConfig, savedPrompts]);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'theme-light', 'theme-sepia', 'theme-forest', 'theme-ocean');
    if (selectedTheme === 'light') {
      document.documentElement.style.colorScheme = 'light';
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.style.colorScheme = 'dark';
      document.documentElement.classList.add('dark');
      if (selectedTheme !== 'dark') document.documentElement.classList.add(`theme-${selectedTheme}`);
    }
    dbSetKey('ui-theme', selectedTheme).catch(() => {});
  }, [selectedTheme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
    dbSetKey('ui-accent', accentColor).catch(() => {});
  }, [accentColor]);

  const handleSaveFileWrapper = useCallback((updatedFile: KBFile) => {
    handleSaveFile(updatedFile);
    fireWebhooks('file:created', { fileName: updatedFile.name, fileId: updatedFile.id });
  }, [handleSaveFile]);

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

  const handleA2ADebate = async (topic: string) => {
    setIsA2ALoading(true);
    const contextDocs = files.filter((f) => f.isActive).map((f) => `### ${f.name}\n${f.content}`).join('\n\n') || undefined;
    const responses = await runA2ADebate(topic, a2aAgents, providerConfig, contextDocs, (agentName, response, latency) => {
      const metric: A2AMetric = {
        id: `m-${Date.now()}-${agentName}`,
        timestamp: new Date().toISOString(),
        topic,
        agentId: a2aAgents.find((a) => a.name === agentName)?.id || '',
        agentName,
        latencyMs: latency,
        tokensEstimated: Math.round(response.length / 4),
        status: 'success',
      };
      setA2aMetrics((prev) => [...prev, metric]);
    });
    setIsA2ALoading(false);
    fireWebhooks('a2a:complete', { topic, agentCount: a2aAgents.length });
    const summaryMsg: ChatMessage = {
      id: `debate-${Date.now()}`,
      text: `## A2A Debate Results\n\n${a2aAgents.map((a, i) => `### ${a.name}\n${responses[i]}`).join('\n\n')}\n\n### Consensus\n${responses[responses.length - 1]}`,
      sender: MessageSender.MODEL,
      timestamp: new Date(),
    };
    setMessages([...messages, summaryMsg]);
  };

  const handleOrchestratedDebate = async () => {
    const topic = `Design a comprehensive knowledge management strategy for field researchers`;
    setIsA2ALoading(true);
    const contextDocs = files.filter((f) => f.isActive).map((f) => `### ${f.name}\n${f.content}`).join('\n\n') || undefined;
    const response = await runOrchestratedWorkflow(topic, a2aAgents, providerConfig, contextDocs, (agentName, response, latency) => {
      const metric: A2AMetric = {
        id: `m-${Date.now()}-${agentName}`,
        timestamp: new Date().toISOString(), topic,
        agentId: a2aAgents.find((a) => a.name === agentName)?.id || '',
        agentName, latencyMs: latency,
        tokensEstimated: Math.round(response.length / 4),
        status: 'success',
      };
      setA2aMetrics((prev) => [...prev, metric]);
    });
    setIsA2ALoading(false);
    const summaryMsg: ChatMessage = {
      id: `orch-${Date.now()}`, text: response,
      sender: MessageSender.MODEL, timestamp: new Date(),
    };
    setMessages([...messages, summaryMsg]);
  };

  const handleSequentialDebate = async () => {
    const topic = `Draft a research report on epidemiological trends in emerging infectious diseases`;
    setIsA2ALoading(true);
    const contextDocs = files.filter((f) => f.isActive).map((f) => `### ${f.name}\n${f.content}`).join('\n\n') || undefined;
    const rawChain = [
      a2aAgents.find((a) => a.id === 'research')!,
      a2aAgents.find((a) => a.id === 'writer')!,
      a2aAgents.find((a) => a.id === 'review')!,
      a2aAgents.find((a) => a.id === 'coord')!,
    ].filter(Boolean);
    const workflowChain = rawChain.map((a) => ({ agentId: a.id, name: a.name, systemPrompt: a.systemPrompt }));
    if (workflowChain.length < 2) { setIsA2ALoading(false); return; }
    const response = await runSequentialWorkflow(topic, workflowChain, providerConfig, contextDocs, (agentName, response, latency) => {
      const metric: A2AMetric = {
        id: `m-seq-${Date.now()}-${agentName}`,
        timestamp: new Date().toISOString(), topic,
        agentId: a2aAgents.find((a) => a.name === agentName)?.id || '',
        agentName, latencyMs: latency,
        tokensEstimated: Math.round(response.length / 4),
        status: 'success',
      };
      setA2aMetrics((prev) => [...prev, metric]);
    });
    setIsA2ALoading(false);
    const summaryMsg: ChatMessage = {
      id: `seq-${Date.now()}`, text: response,
      sender: MessageSender.MODEL, timestamp: new Date(),
    };
    setMessages([...messages, summaryMsg]);
  };

  const handleSaveAgent = (agent: A2AAgent) => {
    setA2aAgents((prev) => {
      const exists = prev.some((a) => a.id === agent.id);
      return exists ? prev.map((a) => a.id === agent.id ? agent : a) : [...prev, agent];
    });
    setShowAgentBuilder(false);
    setEditingAgent(undefined);
  };

  const handleDeleteAgent = (id: string) => {
    setA2aAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddWebhook = (config: Omit<WebhookConfig, 'id' | 'createdAt'>) => {
    const hook = addWebhook(config);
    setWebhooks(getAllWebhooks());
    return hook;
  };

  const handleRemoveWebhook = (id: string) => {
    removeWebhookSvc(id);
    setWebhooks(getAllWebhooks());
  };

  const handleUpdateWebhook = (id: string, updates: Partial<WebhookConfig>) => {
    updateWebhookSvc(id, updates);
    setWebhooks(getAllWebhooks());
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (parsed.files) setFiles(parsed.files);
      if (parsed.folders) setFolders(parsed.folders);
      if (parsed.providerConfig) setProviderConfig(parsed.providerConfig);
      if (parsed.savedPrompts) setSavedPrompts(parsed.savedPrompts);
      if (parsed.a2aAgents) setA2aAgents(parsed.a2aAgents);
      if (parsed.kanban) setKanbanBoards(parsed.kanban.map((b: any) => JSON.parse(b.boards)));
      if (parsed.mcpServers) setMcpServers(parsed.mcpServers);
      await importAllData(text);
    } catch {}
    e.target.value = '';
  };

  const handleExportAll = async () => {
    const data = await exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oks-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeBoard = kanbanBoards.find((b) => b.id === activeBoardId) || null;

  const handleUpdateBoard = useCallback((board: KanbanBoard) => {
    setKanbanBoards((prev) => prev.map((b) => b.id === board.id ? board : b));
  }, []);

  const handleCreateBoard = useCallback((title: string) => {
    const board: KanbanBoard = {
      id: `board-${Date.now()}`,
      title,
      columns: [
        { id: 'col-todo', title: 'To Do', color: '#3B82F6', order: 0 },
        { id: 'col-progress', title: 'In Progress', color: '#F59E0B', order: 1 },
        { id: 'col-done', title: 'Done', color: '#10B981', order: 2 },
      ],
      cards: [],
    };
    setKanbanBoards((prev) => [...prev, board]);
    setActiveBoardId(board.id);
  }, []);

  const handleDeleteBoard = useCallback((id: string) => {
    setKanbanBoards((prev) => prev.filter((b) => b.id !== id));
    if (activeBoardId === id) {
      setKanbanBoards((prev) => {
        if (prev.length > 0) setActiveBoardId(prev[0].id);
        return prev;
      });
    }
  }, [activeBoardId]);

  const handleMCPAddServer = useCallback((server: MCPServer) => {
    setMcpServers((prev) => {
      const updated = prev.some((s) => s.id === server.id)
        ? prev.map((s) => s.id === server.id ? server : s)
        : [...prev, server];
      dbPut('sandbox', { id: 'mcp-servers', settings: JSON.stringify(updated) }).catch(() => {});
      return updated;
    });
  }, []);

  const handleMCPRemoveServer = useCallback((id: string) => {
    setMcpServers((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      dbPut('sandbox', { id: 'mcp-servers', settings: JSON.stringify(updated) }).catch(() => {});
      return updated;
    });
  }, []);

  const handleMCPToggleTool = useCallback((serverId: string, toolName: string) => {
    setMcpServers((prev) => prev.map((s) => s.id === serverId ? {
      ...s, tools: s.tools.map((t) => t.name === toolName ? { ...t, isActive: !t.isActive } : t),
    } : s));
  }, []);

  const navItems: { view: AppView; icon: React.ReactNode; label: string }[] = [
    { view: 'chat', icon: <MessageSquare size={14} />, label: 'Chat' },
    { view: 'editor', icon: <Edit size={14} />, label: 'Editor' },
    { view: 'search', icon: <Search size={14} />, label: 'Search' },
    { view: 'observability', icon: <Activity size={14} />, label: 'Dashboard' },
    { view: 'kanban', icon: <Kanban size={14} />, label: 'Kanban' },
    { view: 'templates', icon: <Template size={14} />, label: 'Templates' },
    { view: 'mcp', icon: <Database size={14} />, label: 'MCP' },
  ];

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-[#0f0f1a] text-gray-200 overflow-hidden">
        <header className="h-11 flex items-center justify-between px-3 bg-[#1a1a2e] border-b border-[#2a2a3e] shrink-0 no-print">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded hover:bg-[#2a2a3e]" aria-label="Toggle sidebar">
              <Menu size={16} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-indigo-400" />
              <span className="text-sm font-semibold hidden sm:inline">Open Knowledge Studio</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">v2.0</span>
            </div>
            <nav className="flex items-center gap-0.5 ml-4 overflow-x-auto" aria-label="Main navigation">
              {navItems.map(({ view, icon, label }) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${activeView === view ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                  aria-label={`Switch to ${label} view`}
                  aria-current={activeView === view ? 'page' : undefined}
                >
                  {icon}
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-[10px]">
              {isOnline ? <Wifi size={12} className="text-green-400" /> : <WifiOff size={12} className="text-red-400" />}
              <span className={`hidden sm:inline ${isOnline ? 'text-green-400' : 'text-red-400'}`}>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            {currentUser && <Cloud size={14} className="text-indigo-400" />}
            {isInstallable && (
              <button onClick={promptInstall} className="p-1.5 rounded hover:bg-[#2a2a3e]" title="Install App">
                <Download size={14} className="text-gray-400" />
              </button>
            )}
            <button onClick={() => { setShowGooglePanel(!showGooglePanel); setShowGmailCompose(false); }} className="p-1.5 rounded hover:bg-[#2a2a3e]" title="Google Workspace" aria-label="Toggle Google Workspace panel">
              <Globe size={14} className="text-gray-400" />
            </button>
            <button onClick={() => { setShowGmailCompose(!showGmailCompose); setShowGooglePanel(false); }} className="p-1.5 rounded hover:bg-[#2a2a3e]" title="Compose Email" disabled={!currentUser} aria-label="Compose email">
              <Mail size={14} className="text-gray-400" />
            </button>
            <button onClick={() => { setShowICD11(!showICD11); setShowEpiMap(false); }} className={`p-1.5 rounded hover:bg-[#2a2a3e] ${showICD11 ? 'bg-indigo-600/20' : ''}`} title="ICD-11 Code Lookup" aria-label="Toggle ICD-11 code lookup">
              <Book size={14} className="text-gray-400" />
            </button>
            <button onClick={() => { setShowEpiMap(!showEpiMap); setShowICD11(false); }} className={`p-1.5 rounded hover:bg-[#2a2a3e] ${showEpiMap ? 'bg-indigo-600/20' : ''}`} title="Epidemiology Map" aria-label="Toggle epidemiology map">
              <MapPin size={14} className="text-gray-400" />
            </button>
            <ThemeSwitcher theme={selectedTheme} onThemeChange={setSelectedTheme} accentColor={accentColor} onAccentColorChange={setAccentColor} />
            <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded hover:bg-[#2a2a3e]" aria-label="Open settings">
              <Settings size={14} className="text-gray-400" />
            </button>
            {currentUser ? (
              <button onClick={logoutUser} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400" title={currentUser.email || ''}>
                {currentUser.photoURL && <img src={currentUser.photoURL} alt="" className="w-5 h-5 rounded-full" />}
              </button>
            ) : (
              <button onClick={signInWithGoogle} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700" aria-label="Sign in with Google">Sign in</button>
            )}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {isSidebarOpen && (
            <aside className="w-72 border-r border-[#2a2a3e] bg-[#1a1a2e]/50 flex flex-col shrink-0 overflow-hidden hidden md:flex" aria-label="Workspace sidebar">
              <div className="flex-1 overflow-y-auto">
                <WorkspaceManager
                  files={files}
                  folders={folders}
                  agents={a2aAgents}
                  tags={tags}
                  activeProjectId={activeProjectId}
                  onSwitchProject={setActiveProjectId}
                  onCreateProject={(name) => {
                    const id = `proj-${Date.now()}`;
                    setFolders((prev) => [...prev, { id, name }]);
                    setActiveProjectId(id);
                  }}
                  onDeleteProject={(id) => {
                    setFolders((prev) => prev.filter((f) => f.id !== id));
                    setFiles((prev) => prev.filter((f) => f.parentFolderId !== id));
                    if (activeProjectId === id) setActiveProjectId('default');
                  }}
                  onAddAgent={() => {}}
                  onRemoveAgent={() => {}}
                />
                <div className="border-t border-[#2a2a3e] my-2" />
                <KnowledgeBaseManager
                  files={files}
                  folders={folders}
                  setFiles={setFiles}
                  setFolders={setFolders}
                  onFileSelect={(file) => { handleFileSelect(file); setActiveView('editor'); }}
                  activeFileId={activeFile?.id || null}
                />
              </div>
            </aside>
          )}

          <main className="flex-1 flex min-w-0 overflow-hidden" aria-label="Main content">
            {activeView === 'chat' && (
              <div className="flex flex-1">
                {showChatSessions && (
                  <ChatSessionSidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSwitch={switchSession}
                    onCreate={createSession}
                    onDelete={deleteSession}
                    onClose={() => setShowChatSessions(false)}
                  />
                )}
                <div className="flex-1 flex flex-col min-w-0" aria-live="polite">
                  <div className="flex items-center gap-2 px-3 py-1 border-b border-[#2a2a3e] shrink-0">
                    <button onClick={() => setShowChatSessions(!showChatSessions)} className="p-1 rounded hover:bg-[#2a2a3e] text-gray-400" title="Chat sessions" aria-label="Toggle chat sessions">
                      <MessageSquare size={12} />
                    </button>
                    <span className="text-[10px] text-gray-500">{sessions.length} sessions</span>
                    <button onClick={createSession} className="ml-auto p-1 rounded hover:bg-[#2a2a3e] text-gray-400" title="New chat" aria-label="New chat"><Plus size={12} /></button>
                  </div>
                  <ChatInterface
                    messages={messages}
                    setMessages={setMessages}
                    providerConfig={providerConfig}
                    files={files}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    initialSuggestions={initialSuggestions}
                    isFetchingSuggestions={isFetchingSuggestions}
                    setIsFetchingSuggestions={setIsFetchingSuggestions}
                    setInitialSuggestions={setInitialSuggestions}
                    onMessageSent={(text) => fireWebhooks('chat:message', { text, sender: 'user' })}
                  />
                </div>
              </div>
            )}

            {activeView === 'editor' && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-xs">Loading...</div>}>
                <WorkspaceDocumentEditor
                  file={activeFile}
                  onSave={handleSaveFileWrapper}
                  versions={documentVersions}
                  onSaveVersion={handleSaveVersion}
                  templates={templates.map((t) => ({ id: t.id, name: t.name, content: t.content, category: t.category }))}
                />
              </React.Suspense>
            )}

            {activeView === 'search' && (
              <SearchPanel files={files} tags={tags} onFileSelect={(file) => { handleFileSelect(file); setActiveView('editor'); }} />
            )}

            {activeView === 'observability' && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-xs">Loading...</div>}>
                <A2AMetricsDashboard metrics={a2aMetrics} agents={a2aAgents.map((a) => ({ id: a.id, name: a.name, color: a.color, avatar: a.avatar }))} />
              </React.Suspense>
            )}

            {activeView === 'kanban' && (
              <KanbanBoardView
                board={activeBoard}
                boards={kanbanBoards}
                onUpdateBoard={handleUpdateBoard}
                onCreateBoard={handleCreateBoard}
                onDeleteBoard={handleDeleteBoard}
                onSwitchBoard={(id) => setActiveBoardId(id)}
              />
            )}

            {activeView === 'mcp' && (
              <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-xs">Loading...</div>}>
                <MCPServerPanel
                  servers={mcpServers}
                  onAddServer={handleMCPAddServer}
                  onRemoveServer={handleMCPRemoveServer}
                  onToggleTool={handleMCPToggleTool}
                />
              </React.Suspense>
            )}

            {activeView === 'templates' && (
              <div className="p-4 overflow-y-auto">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Template size={16} className="text-indigo-400" /> Document Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map((t) => (
                    <div key={t.id} className="p-4 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] hover:border-indigo-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-medium">{t.name}</h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{t.category}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mb-3">{t.description}</p>
                      <button
                        onClick={() => {
                          const newFile: KBFile = {
                            id: `template-${Date.now()}`,
                            name: `${t.name}.md`,
                            type: 'markdown',
                            content: t.content,
                            size: `${(t.content.length / 1024).toFixed(1)} KB`,
                            parentFolderId: null,
                            isActive: false,
                            createdAt: new Date(),
                          };
                          setFiles((prev) => [newFile, ...prev]);
                          setActiveFile(newFile);
                          setActiveView('editor');
                        }}
                        className="text-[10px] bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                        aria-label={`Use template: ${t.name}`}
                      >
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {showGooglePanel && (
            <aside className="w-80 border-l border-[#2a2a3e] bg-[#1a1a2e]/50 shrink-0 hidden md:block">
              <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-xs">Loading...</div>}>
                <GoogleWorkspacePanel currentFile={activeFile || undefined} />
              </React.Suspense>
            </aside>
          )}

          {showGmailCompose && (
            <aside className="w-80 border-l border-[#2a2a3e] bg-[#1a1a2e]/50 shrink-0 hidden md:block">
              <GmailCompose
                currentFile={activeFile || undefined}
                userEmail={currentUser?.email}
                onClose={() => setShowGmailCompose(false)}
              />
            </aside>
          )}

          {showICD11 && (
            <aside className="w-80 border-l border-[#2a2a3e] shrink-0 hidden md:block">
              <ICD11Lookup
                onSelect={(entry) => console.log('ICD-11 Selected:', entry)}
                onClose={() => setShowICD11(false)}
              />
            </aside>
          )}

          {showEpiMap && (
            <aside className="w-80 border-l border-[#2a2a3e] bg-[#1a1a2e]/50 shrink-0 hidden md:block">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2a3e] shrink-0">
                  <h2 className="text-xs font-semibold flex items-center gap-1.5">
                    <MapPin size={12} className="text-indigo-400" />
                    Epidemiology Map
                  </h2>
              <button onClick={() => setShowEpiMap(false)} className="p-1 rounded hover:bg-[#2a2a3e] text-gray-400" aria-label="Close epidemiology map">
                <X size={12} />
              </button>
                </div>
                <div className="flex-1 overflow-hidden p-2">
                  <EpiMap dataPoints={epiDataPoints} height="100%" timelineData={epiTimelineData} onTimeChange={handleEpiTimeChange} />
                </div>
              </div>
            </aside>
          )}
        </div>

        {showAgentBuilder && (
          <AgentBuilder
            onSave={handleSaveAgent}
            onClose={() => { setShowAgentBuilder(false); setEditingAgent(undefined); }}
            editAgent={editingAgent}
          />
        )}

        <React.Suspense fallback={<div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-xs">Loading...</div>}>
          <SettingsPanel
            show={showSettings}
            onClose={() => setShowSettings(false)}
            providerConfig={providerConfig}
            onProviderConfigChange={setProviderConfig}
            a2aAgents={a2aAgents}
            isA2ALoading={isA2ALoading}
            onRunDebate={() => handleA2ADebate('Discuss the best approach to build a resilient knowledge base for field researchers')}
            onExportAll={handleExportAll}
            onImport={handleImport}
            sandboxSettings={sandboxSettings}
            onSandboxChange={setSandboxSettings}
            onEditAgent={(agent) => { setEditingAgent(agent); setShowAgentBuilder(true); }}
            onCreateAgent={() => { setEditingAgent(undefined); setShowAgentBuilder(true); }}
            onDeleteAgent={handleDeleteAgent}
            webhooks={webhooks}
            onAddWebhook={handleAddWebhook}
            onRemoveWebhook={handleRemoveWebhook}
            onUpdateWebhook={handleUpdateWebhook}
          />
        </React.Suspense>

        <footer className="h-6 flex items-center justify-between px-3 bg-[#1a1a2e] border-t border-[#2a2a3e] text-[10px] text-gray-500 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <span>{files.length} files</span>
            <span>{folders.length} folders</span>
            <span>{documentVersions.length} versions</span>
          </div>
          <div className="flex items-center gap-3">
            <span>IndexedDB</span>
            <span>{providerConfig.selectedModel}</span>
            {currentUser && <span className="hidden sm:inline">{currentUser.email}</span>}
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;

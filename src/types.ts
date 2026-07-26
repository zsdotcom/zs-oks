/**
 * Open Knowledge Studio v2 — Shared Type Definitions
 * @license SPDX-License-Identifier: Apache-2.0
 */

/* ─── Message & Chat Types ─── */
export enum MessageSender {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface UrlContextMetadataItem {
  retrievedUrl: string;
  urlRetrievalStatus: string;
}

export interface ToolCallItem {
  toolName: string;
  query: string;
  resultSummary?: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  isLoading?: boolean;
  urlContext?: UrlContextMetadataItem[];
  toolCalls?: ToolCallItem[];
  provider?: string;
  modelName?: string;
  thinkingSeconds?: number;
  thinkingContent?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  provider: LLMProvider;
  modelName: string;
}

/* ─── LLM Provider Types ─── */
export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'groq' | 'ollama' | 'openrouter' | 'cerebras' | 'github' | 'cloudflare';

export interface ProviderConfig {
  provider: LLMProvider;
  apiKey: string;
  selectedModel: string;
  temperature: number;
  enableThinking: boolean;
  thinkingLevel: 'low' | 'medium' | 'high';
  enableSearchGrounding: boolean;
  enableMapsGrounding: boolean;
  maxTokens?: number;
  customEndpoint?: string;
}

export interface ProviderOption {
  id: LLMProvider;
  name: string;
  baseUrl: string;
  models: string[];
  freeTier: string;
}

export const PROVIDER_OPTIONS: ProviderOption[] = [
  { id: 'gemini', name: 'Google Gemini', baseUrl: '', models: ['gemini-3.5-flash', 'gemini-2.5-pro', 'gemini-1.5-pro'], freeTier: '5-15 RPM, 1M tokens' },
  { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1'], freeTier: '$5 trial credit' },
  { id: 'anthropic', name: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1', models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'], freeTier: '$5 trial credit' },
  { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', models: ['deepseek-chat', 'deepseek-reasoner'], freeTier: '10M token trial' },
  { id: 'groq', name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'], freeTier: '30 RPM, 128K tokens' },
  { id: 'ollama', name: 'Ollama (Local)', baseUrl: 'http://localhost:11434', models: ['llama3', 'mistral', 'codellama'], freeTier: 'Unlimited (local)' },
  { id: 'openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', models: ['openrouter/auto', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.5-flash'], freeTier: '20 RPM, 20+ models' },
  { id: 'cerebras', name: 'Cerebras', baseUrl: 'https://api.cerebras.ai/v1', models: ['llama3.1-70b', 'llama3.1-8b'], freeTier: '30 RPM, 1M tokens/day' },
  { id: 'github', name: 'GitHub Models', baseUrl: 'https://models.inference.ai.azure.com/v1', models: ['gpt-4o', 'claude-3.5-sonnet', 'gemini-2.5-flash'], freeTier: '15 RPM, GPT-4o/Claude' },
  { id: 'cloudflare', name: 'Cloudflare Workers AI', baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1', models: ['@cf/meta/llama-3.3-70b-instruct'], freeTier: '10K neurons/day, 20+ models' },
];

/* ─── Knowledge Base File & Folder Types ─── */
export type FileType = 'pdf' | 'doc' | 'sheet' | 'slides' | 'csv' | 'json' | 'markdown' | 'text' | 'image';

export interface KBFile {
  id: string;
  name: string;
  type: FileType;
  content: string;
  size: string;
  url?: string;
  parentFolderId?: string | null;
  isActive: boolean;
  createdAt: Date;
  metadata?: {
    rowsCount?: number;
    pagesCount?: number;
    slideCount?: number;
  };
}

export interface KBFolder {
  id: string;
  name: string;
  parentFolderId?: string | null;
}

/* ─── URL Groups (for AI context grounding) ─── */
export interface URLGroup {
  id: string;
  name: string;
  urls: string[];
  userId?: string;
}

/* ─── MCP Tool & Server Standards ─── */
export interface MCPTool {
  name: string;
  description: string;
  parameters: string;
  isActive: boolean;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected';
  tools: MCPTool[];
}

/* ─── A2A Collaboration Types ─── */
export type MemoryType = 'none' | 'session' | 'persistent' | 'full';

export interface A2AAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  systemPrompt: string;
  color: string;
  isActive: boolean;
  skills?: string[];
  tools?: string[];
  memoryType?: MemoryType;
  maxTurnDepth?: number;
  provider?: LLMProvider;
  modelName?: string;
}

/* ─── Skill Definition Types ─── */
export type SkillCategory = 'epidemiology' | 'research' | 'writing' | 'data' | 'integration';

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  instructions: string;
  allowedTools: string[];
  priority: 'low' | 'medium' | 'high';
  triggers: string[];
  createdAt: Date;
  updatedAt: Date;
}

/* ─── Tool Definition Types ─── */
export type ToolPermission = 'safe' | 'standard' | 'elevated' | 'admin';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'calculation' | 'visualization' | 'media' | 'file' | 'ai' | 'integration';
  permission: ToolPermission;
  requiresConfirmation: boolean;
  parameters: ToolParameter[];
  isBuiltIn: boolean;
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export const BUILT_IN_TOOLS: ToolDefinition[] = [
  { id: 'search-web', name: 'Web Search', description: 'Search the web via free API', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }], isBuiltIn: true },
  { id: 'search-wikipedia', name: 'Wikipedia Search', description: 'Search and fetch Wikipedia articles', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }], isBuiltIn: true },
  { id: 'search-arxiv', name: 'arXiv Search', description: 'Search academic papers on arXiv', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }], isBuiltIn: true },
  { id: 'search-openalex', name: 'OpenAlex Search', description: 'Search scholarly works via OpenAlex', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }], isBuiltIn: true },
  { id: 'search-pubmed', name: 'PubMed Search', description: 'Search biomedical literature', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }], isBuiltIn: true },
  { id: 'search-who', name: 'WHO Data Query', description: 'Query WHO Global Health Observatory', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'indicator', type: 'string', description: 'WHO indicator code', required: true }], isBuiltIn: true },
  { id: 'search-cdc', name: 'CDC Data Query', description: 'Query CDC public health datasets', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'dataset', type: 'string', description: 'Dataset name', required: true }], isBuiltIn: true },
  { id: 'calculate', name: 'Calculate', description: 'Mathematical computation engine', category: 'calculation', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'expression', type: 'string', description: 'Math expression', required: true }], isBuiltIn: true },
  { id: 'draw-chart', name: 'Draw Chart', description: 'Generate SVG charts', category: 'visualization', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'type', type: 'string', description: 'Chart type (bar, line, pie, scatter)', required: true }, { name: 'data', type: 'string', description: 'JSON data', required: true }], isBuiltIn: true },
  { id: 'draw-diagram', name: 'Draw Diagram', description: 'Render Mermaid diagrams', category: 'visualization', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'code', type: 'string', description: 'Mermaid code', required: true }], isBuiltIn: true },
  { id: 'render-latex', name: 'Render LaTeX', description: 'Typeset mathematical formulas', category: 'visualization', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'formula', type: 'string', description: 'LaTeX formula', required: true }], isBuiltIn: true },
  { id: 'translate', name: 'Translate', description: 'Text translation', category: 'media', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'text', type: 'string', description: 'Text to translate', required: true }, { name: 'targetLang', type: 'string', description: 'Target language code', required: true }], isBuiltIn: true },
  { id: 'speak', name: 'Text-to-Speech', description: 'Text-to-speech synthesis', category: 'media', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'text', type: 'string', description: 'Text to speak', required: true }], isBuiltIn: true },
  { id: 'dictate', name: 'Speech-to-Text', description: 'Speech-to-text dictation', category: 'media', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'language', type: 'string', description: 'Language code', required: false, defaultValue: 'en-US' }], isBuiltIn: true },
  { id: 'read-file', name: 'Read File', description: 'Read uploaded or local files', category: 'file', permission: 'elevated', requiresConfirmation: false, parameters: [{ name: 'fileId', type: 'string', description: 'File ID or path', required: true }], isBuiltIn: true },
  { id: 'write-file', name: 'Write File', description: 'Save outputs to filesystem', category: 'file', permission: 'elevated', requiresConfirmation: true, parameters: [{ name: 'name', type: 'string', description: 'File name', required: true }, { name: 'content', type: 'string', description: 'File content', required: true }], isBuiltIn: true },
  { id: 'vectorize', name: 'Vectorize', description: 'Generate text embeddings', category: 'ai', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'text', type: 'string', description: 'Text to vectorize', required: true }], isBuiltIn: true },
  { id: 'semantic-search', name: 'Semantic Search', description: 'Vector similarity search across memory', category: 'ai', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }, { name: 'topK', type: 'number', description: 'Results count', required: false, defaultValue: 5 }], isBuiltIn: true },
  { id: 'export-pdf', name: 'Export PDF', description: 'Export documents as PDF', category: 'file', permission: 'elevated', requiresConfirmation: true, parameters: [{ name: 'content', type: 'string', description: 'Document content', required: true }, { name: 'title', type: 'string', description: 'Document title', required: true }], isBuiltIn: true },
  { id: 'rss-fetch', name: 'RSS Feed Fetch', description: 'Parse and monitor RSS feeds', category: 'integration', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'url', type: 'string', description: 'RSS feed URL', required: true }], isBuiltIn: true },
  { id: 'remember', name: 'Remember', description: 'Store a memory with key, value, and tier', category: 'ai', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'key', type: 'string', description: 'Memory key', required: true }, { name: 'value', type: 'string', description: 'Memory value', required: true }, { name: 'tier', type: 'string', description: 'Memory tier (session/episodic/semantic/procedural/working/long_term)', required: false, defaultValue: 'session' }], isBuiltIn: true },
  { id: 'recall', name: 'Recall', description: 'Search memories using fuzzy or semantic matching', category: 'ai', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }, { name: 'tier', type: 'string', description: 'Memory tier filter', required: false }, { name: 'topK', type: 'number', description: 'Results count', required: false, defaultValue: 5 }], isBuiltIn: true },
  { id: 'forget', name: 'Forget', description: 'Remove a specific memory entry', category: 'ai', permission: 'safe', requiresConfirmation: true, parameters: [{ name: 'key', type: 'string', description: 'Memory key or id', required: true }, { name: 'tier', type: 'string', description: 'Memory tier', required: false }], isBuiltIn: true },
  { id: 'spawn-agent', name: 'Spawn Agent', description: 'Create a sub-agent instance with isolated workspace', category: 'integration', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'name', type: 'string', description: 'Agent name', required: true }, { name: 'role', type: 'string', description: 'Agent role', required: true }, { name: 'systemPrompt', type: 'string', description: 'System prompt', required: true }], isBuiltIn: true },
  { id: 'list-agents', name: 'List Agents', description: 'List all active agents and their status', category: 'integration', permission: 'safe', requiresConfirmation: false, parameters: [], isBuiltIn: true },
  { id: 'status-track', name: 'Status Track', description: 'Update and broadcast task progress', category: 'integration', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'taskId', type: 'string', description: 'Task ID', required: true }, { name: 'status', type: 'string', description: 'Status (pending/running/completed/failed)', required: true }], isBuiltIn: true },
  { id: 'send-message', name: 'Send Message', description: 'A2A inter-agent communication', category: 'integration', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'to', type: 'string', description: 'Recipient agent ID', required: true }, { name: 'message', type: 'string', description: 'Message content', required: true }], isBuiltIn: true },
];

/* ─── Workspace Project Types ─── */
export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  fileCount: number;
  agentCount: number;
  tags: string[];
  sourceUrl?: string;
  agentIds: string[];
}

export interface SavedPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  createdAt: Date | string;
}

/* ─── Observability & Metrics ─── */
export interface A2AMetric {
  id: string;
  timestamp: string;
  topic: string;
  agentId: string;
  agentName: string;
  latencyMs: number;
  thinkingSeconds?: number;
  tokensEstimated: number;
  status: 'success' | 'error';
}

/* ─── Sandbox Settings ─── */
export interface SandboxSettings {
  strictSandbox: boolean;
  allowedOutbound: boolean;
  showAuditLedger: boolean;
}

/* ─── Document Version History (v2 NEW) ─── */
export interface DocumentVersion {
  id: string;
  documentId: string;
  content: string;
  createdAt: Date;
  size: string;
  label?: string;
}

/* ─── Kanban Task Board (v2 NEW) ─── */
export interface TaskColumn {
  id: string;
  title: string;
  color: string;
  order: number;
}

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  tags: string[];
  assignee?: string;
  createdAt: Date;
}

export interface KanbanBoard {
  id: string;
  title: string;
  columns: TaskColumn[];
  cards: TaskCard[];
}

/* ─── Document Tag & Category (v2 NEW) ─── */
export interface DocumentTag {
  id: string;
  name: string;
  color: string;
}

/* ─── Feedback Item (v2 NEW) ─── */
export interface FeedbackItem {
  id: string;
  documentId: string;
  userId: string;
  type: 'helpful' | 'not_helpful';
  comment?: string;
  createdAt: Date;
}

/* ─── Template Types (v2 NEW) ─── */
export type TemplateCategory = 'epidemiology' | 'clinical' | 'research' | 'project' | 'mcp' | 'mermaid' | 'math' | 'custom';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  content: string;
  icon?: string;
}

/* ─── Knowledge Source Types ─── */
export interface KnowledgeSource {
  id: string;
  name: 'wikipedia' | 'arxiv' | 'openalex' | 'pubmed' | 'semantic-scholar' | 'who-gho' | 'cdc-wonder' | 'gdelt' | 'crossref' | 'rss' | 'google-scholar' | 'core';
  displayName: string;
  baseUrl: string;
  enabled: boolean;
  rateLimit: string;
  requiresKey: boolean;
  lastFetch?: Date;
}

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  { id: 'ks-wiki', name: 'wikipedia', displayName: 'Wikipedia', baseUrl: 'https://en.wikipedia.org/api/rest_v1', enabled: true, rateLimit: 'Unlimited', requiresKey: false },
  { id: 'ks-arxiv', name: 'arxiv', displayName: 'arXiv', baseUrl: 'https://export.arxiv.org/api', enabled: true, rateLimit: 'Unlimited', requiresKey: false },
  { id: 'ks-openalex', name: 'openalex', displayName: 'OpenAlex', baseUrl: 'https://api.openalex.org', enabled: true, rateLimit: '100K/day', requiresKey: false },
  { id: 'ks-pubmed', name: 'pubmed', displayName: 'PubMed', baseUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils', enabled: true, rateLimit: '10/sec', requiresKey: false },
  { id: 'ks-semantic', name: 'semantic-scholar', displayName: 'Semantic Scholar', baseUrl: 'https://api.semanticscholar.org/graph/v1', enabled: true, rateLimit: '100/sec', requiresKey: false },
  { id: 'ks-who', name: 'who-gho', displayName: 'WHO GHO', baseUrl: 'https://ghoapi.azureedge.net/api', enabled: true, rateLimit: 'Unlimited', requiresKey: false },
  { id: 'ks-cdc', name: 'cdc-wonder', displayName: 'CDC WONDER', baseUrl: 'https://wonder.cdc.gov', enabled: true, rateLimit: 'Unlimited', requiresKey: false },
  { id: 'ks-gdelt', name: 'gdelt', displayName: 'GDELT', baseUrl: 'https://api.gdeltproject.org/api/v2', enabled: true, rateLimit: '20/min', requiresKey: false },
  { id: 'ks-crossref', name: 'crossref', displayName: 'CrossRef', baseUrl: 'https://api.crossref.org', enabled: true, rateLimit: '50/sec', requiresKey: false },
  { id: 'ks-rss', name: 'rss', displayName: 'RSS Feeds', baseUrl: '', enabled: true, rateLimit: 'User-defined', requiresKey: false },
];

export interface KnowledgeFetchResult {
  source: string;
  query: string;
  results: KnowledgeResultItem[];
  timestamp: Date;
  cached: boolean;
}

export interface KnowledgeResultItem {
  title: string;
  url: string;
  snippet: string;
  source: string;
  date?: string;
  authors?: string[];
  doi?: string;
  confidence: 'high' | 'medium' | 'low';
}

/* ─── Connector Types ─── */
export interface ConnectorConfig {
  id: string;
  name: string;
  type: 'github' | 'slack' | 'rss' | 'email' | 'webhook';
  enabled: boolean;
  config: Record<string, string>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

/* ─── App-wide State ─── */
export type AppView = 'chat' | 'editor' | 'observability' | 'kanban' | 'templates' | 'search' | 'settings' | 'mcp' | 'skills' | 'tools' | 'knowledge' | 'docs';

export interface AppState {
  currentUser: AppUser | null;
  files: KBFile[];
  folders: KBFolder[];
  chatMessages: ChatMessage[];
  providerConfig: ProviderConfig;
  urlGroups: URLGroup[];
  savedPrompts: SavedPrompt[];
  a2aAgents: A2AAgent[];
  a2aMetrics: A2AMetric[];
  sandboxSettings: SandboxSettings;
  activeView: AppView;
  isDarkMode: boolean;
  isOnline: boolean;
  kanbanBoards: KanbanBoard[];
  documentVersions: DocumentVersion[];
  templates: DocumentTemplate[];
  tags: DocumentTag[];
}

/* ─── Google Auth Types ─── */
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/* ─── Search Result Type ─── */
export interface SearchResult {
  fileId: string;
  fileName: string;
  score: number;
  snippet: string;
  matchedField: 'name' | 'content' | 'tags';
}

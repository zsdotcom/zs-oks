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
export type SkillCategory = 'epidemiology' | 'research' | 'writing' | 'data' | 'integration' | 'code' | 'media' | 'knowledge';

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
  category: 'search' | 'calculation' | 'visualization' | 'media' | 'file' | 'ai' | 'code' | 'integration' | 'data';
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
  { id: 'code-review', name: 'Code Review', description: 'Analyze source code for bugs, style issues, and security vulnerabilities', category: 'ai', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'code', type: 'string', description: 'Source code to review', required: true }, { name: 'language', type: 'string', description: 'Programming language', required: false, defaultValue: 'auto' }], isBuiltIn: true },
  { id: 'test-generate', name: 'Generate Tests', description: 'Generate unit/integration test cases from source code', category: 'ai', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'code', type: 'string', description: 'Source code to test', required: true }, { name: 'framework', type: 'string', description: 'Testing framework (vitest/jest/pytest)', required: false, defaultValue: 'vitest' }], isBuiltIn: true },
  { id: 'web-scrape', name: 'Web Scrape', description: 'Extract content from web pages', category: 'integration', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'url', type: 'string', description: 'Page URL', required: true }, { name: 'selector', type: 'string', description: 'CSS selector (optional)', required: false }], isBuiltIn: true },
  { id: 'html-to-markdown', name: 'HTML to Markdown', description: 'Convert HTML content to Markdown', category: 'media', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'html', type: 'string', description: 'HTML content', required: true }], isBuiltIn: true },
  { id: 'json-schema-infer', name: 'Infer JSON Schema', description: 'Infer JSON Schema from sample data', category: 'data', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'data', type: 'string', description: 'JSON sample data', required: true }], isBuiltIn: true },
  { id: 'markdown-toc', name: 'Markdown TOC', description: 'Generate table of contents from Markdown', category: 'media', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'markdown', type: 'string', description: 'Markdown content', required: true }], isBuiltIn: true },
  { id: 'sentiment-analyze', name: 'Sentiment Analysis', description: 'Analyze sentiment of text (positive/negative/neutral)', category: 'ai', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'text', type: 'string', description: 'Text to analyze', required: true }], isBuiltIn: true },
  { id: 'entity-extract', name: 'Entity Extraction', description: 'Extract named entities (people, places, orgs, dates) from text', category: 'ai', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'text', type: 'string', description: 'Text to extract entities from', required: true }], isBuiltIn: true },
  { id: 'text-summarize', name: 'Summarize Text', description: 'Generate concise summary of long texts', category: 'ai', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'text', type: 'string', description: 'Text to summarize', required: true }, { name: 'maxLength', type: 'number', description: 'Max summary length (words)', required: false, defaultValue: 200 }], isBuiltIn: true },
  { id: 'topic-model', name: 'Topic Modeling', description: 'Identify key topics and themes in text content', category: 'ai', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'text', type: 'string', description: 'Text to analyze', required: true }, { name: 'numTopics', type: 'number', description: 'Number of topics', required: false, defaultValue: 5 }], isBuiltIn: true },
  { id: 'dependency-analyze', name: 'Dependency Analysis', description: 'Analyze dependencies between files, functions, or modules', category: 'search', permission: 'elevated', requiresConfirmation: false, parameters: [{ name: 'source', type: 'string', description: 'Source data to analyze', required: true }], isBuiltIn: true },
  { id: 'code-docgen', name: 'Code Documentation', description: 'Generate documentation comments from source code', category: 'ai', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'code', type: 'string', description: 'Source code to document', required: true }, { name: 'style', type: 'string', description: 'Doc style (jsdoc/pydoc/rst)', required: false, defaultValue: 'jsdoc' }], isBuiltIn: true },
  { id: 'data-validate', name: 'Data Validation', description: 'Validate data against a schema or set of rules', category: 'data', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'data', type: 'string', description: 'Data to validate', required: true }, { name: 'schema', type: 'string', description: 'Validation schema/rules', required: true }], isBuiltIn: true },
  { id: 'api-spec-gen', name: 'API Spec Generator', description: 'Generate OpenAPI/Swagger spec from code or description', category: 'ai', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'description', type: 'string', description: 'API description', required: true }, { name: 'format', type: 'string', description: 'Spec format (openapi/swagger)', required: false, defaultValue: 'openapi' }], isBuiltIn: true },
  { id: 'code-format', name: 'Code Formatter', description: 'Format source code with standard style rules', category: 'media', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'code', type: 'string', description: 'Source code to format', required: true }, { name: 'language', type: 'string', description: 'Language (auto/js/ts/py)', required: false, defaultValue: 'auto' }], isBuiltIn: true },
  { id: 'sql-query', name: 'SQL Query Builder', description: 'Generate and analyze SQL queries', category: 'data', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'description', type: 'string', description: 'Query description in natural language', required: true }, { name: 'dialect', type: 'string', description: 'SQL dialect', required: false, defaultValue: 'postgresql' }], isBuiltIn: true },
  { id: 'batch-process', name: 'Batch Process', description: 'Process multiple items through a pipeline with status tracking', category: 'integration', permission: 'elevated', requiresConfirmation: true, parameters: [{ name: 'items', type: 'string', description: 'JSON array of items to process', required: true }, { name: 'operation', type: 'string', description: 'Operation to apply to each item', required: true }], isBuiltIn: true },
  { id: 'github-search', name: 'GitHub Search', description: 'Search GitHub repositories, code, or issues', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }, { name: 'type', type: 'string', description: 'Search type (repos/code/issues)', required: false, defaultValue: 'repos' }], isBuiltIn: true },
  { id: 'world-bank', name: 'World Bank Data', description: 'Query World Bank indicators and country data', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'indicator', type: 'string', description: 'World Bank indicator code', required: true }, { name: 'country', type: 'string', description: 'Country code', required: false, defaultValue: 'all' }], isBuiltIn: true },
  { id: 'open-library', name: 'Open Library Search', description: 'Search Open Library for books and works', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }, { name: 'limit', type: 'number', description: 'Max results', required: false, defaultValue: 20 }], isBuiltIn: true },
  { id: 'news-headlines', name: 'News Headlines', description: 'Fetch top news headlines by category', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'category', type: 'string', description: 'News category (health/science/tech/business)', required: false, defaultValue: 'health' }, { name: 'country', type: 'string', description: 'Country code', required: false, defaultValue: 'us' }], isBuiltIn: true },
  { id: 'google-books', name: 'Google Books Search', description: 'Search Google Books for publications', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }, { name: 'maxResults', type: 'number', description: 'Max results', required: false, defaultValue: 20 }], isBuiltIn: true },
  { id: 'europe-pmc', name: 'Europe PMC Search', description: 'Search Europe PubMed Central for life science literature', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }, { name: 'pageSize', type: 'number', description: 'Results per page', required: false, defaultValue: 20 }], isBuiltIn: true },
  { id: 'crossref', name: 'CrossRef Search', description: 'Search CrossRef for scholarly works and DOIs', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Search query', required: true }, { name: 'rows', type: 'number', description: 'Result count', required: false, defaultValue: 20 }], isBuiltIn: true },
  { id: 'discord-send', name: 'Discord Webhook', description: 'Send a message via Discord webhook', category: 'integration', permission: 'elevated', requiresConfirmation: true, parameters: [{ name: 'webhookUrl', type: 'string', description: 'Full Discord webhook URL', required: true }, { name: 'message', type: 'string', description: 'Message content', required: true }], isBuiltIn: true },
  { id: 'telegram-send', name: 'Telegram Bot', description: 'Send a message via Telegram bot', category: 'integration', permission: 'elevated', requiresConfirmation: true, parameters: [{ name: 'token', type: 'string', description: 'Telegram bot token', required: true }, { name: 'chatId', type: 'string', description: 'Chat ID', required: true }, { name: 'message', type: 'string', description: 'Message text', required: true }], isBuiltIn: true },
  { id: 'snippet-expand', name: 'Snippet Expand', description: 'Expand #hashtag-style snippets into full text from the snippet library', category: 'media', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'snippet', type: 'string', description: 'Snippet key or #tag', required: true }], isBuiltIn: true },
  { id: 'token-estimate', name: 'Token Estimator', description: 'Estimate token count for text across major tokenizers (GPT-4, Claude, Gemini)', category: 'calculation', permission: 'safe', requiresConfirmation: false, parameters: [{ name: 'text', type: 'string', description: 'Text to estimate tokens for', required: true }, { name: 'model', type: 'string', description: 'Model tokenizer (gpt-4/gpt-3.5/claude/gemini)', required: false, defaultValue: 'gpt-4' }], isBuiltIn: true },
  { id: 'context-prune', name: 'Context Pruner', description: 'Prune and optimize chat context to stay within token limits while preserving key information', category: 'ai', permission: 'standard', requiresConfirmation: true, parameters: [{ name: 'messages', type: 'string', description: 'JSON array of messages to prune', required: true }, { name: 'maxTokens', type: 'number', description: 'Target token limit', required: false, defaultValue: 16000 }], isBuiltIn: true },
  { id: 'task-schedule', name: 'Task Scheduler', description: 'Schedule recurring tasks with cron-like timing and webhook callbacks', category: 'integration', permission: 'elevated', requiresConfirmation: true, parameters: [{ name: 'name', type: 'string', description: 'Task name', required: true }, { name: 'schedule', type: 'string', description: 'Cron expression or interval (e.g. "*/5 * * * *")', required: true }, { name: 'action', type: 'string', description: 'Action to perform when triggered', required: true }], isBuiltIn: true },
  { id: 'deep-research', name: 'Deep Research', description: 'Multi-source research across all knowledge sources with synthesis and citation tracking', category: 'search', permission: 'standard', requiresConfirmation: false, parameters: [{ name: 'query', type: 'string', description: 'Research question', required: true }, { name: 'sources', type: 'string', description: 'Comma-separated source names', required: false, defaultValue: 'all' }, { name: 'depth', type: 'string', description: 'Research depth (quick/normal/deep)', required: false, defaultValue: 'normal' }], isBuiltIn: true },
  { id: 'data-export', name: 'Data Export', description: 'Export data in multiple formats (CSV, JSON, PDF, Markdown)', category: 'data', permission: 'elevated', requiresConfirmation: true, parameters: [{ name: 'data', type: 'string', description: 'Data to export (JSON string)', required: true }, { name: 'format', type: 'string', description: 'Export format (csv/json/pdf/markdown)', required: true }], isBuiltIn: true },
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

/* ─── Connector Types ─── */
export interface ConnectorConfig {
  id: string;
  name: string;
  type: 'github' | 'slack' | 'rss' | 'email' | 'webhook' | 'discord' | 'telegram' | 'notion' | 'linear' | 'jira';
  enabled: boolean;
  config: Record<string, string>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

/* ─── App-wide State ─── */
export type AppView = 'chat' | 'editor' | 'observability' | 'kanban' | 'templates' | 'search' | 'settings' | 'mcp' | 'skills' | 'tools' | 'data' | 'knowledge' | 'docs' | 'nlquery';

/* ─── Google Auth Types ─── */
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}


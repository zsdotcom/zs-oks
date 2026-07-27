/**
 * Multi-Provider LLM Router — Zero-dependency REST API client.
 * Supports: Gemini (3.5 Flash stable), OpenAI, Anthropic, DeepSeek, Groq, Ollama.
 * All calls via plain fetch(), no vendor SDKs.
 * @license SPDX-License-Identifier: Apache-2.0
 */

import { ChatMessage, MessageSender, ProviderConfig, A2AAgent } from '../types';

/* ─── Gemini 3.5 Flash (Stable) ─── */
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

interface GeminiRequest {
  contents: { role: string; parts: { text: string }[] }[];
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
    thinkingConfig?: { thinkingBudget?: number };
  };
  tools?: { google_search?: Record<string, never> }[];
}

export async function queryLLM(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs?: string,
  systemPrompt?: string
): Promise<string> {
  switch (config.provider) {
    case 'gemini':
      return queryGemini(messages, config, contextDocs, systemPrompt);
    case 'openai':
      return queryOpenAICompatible(messages, config, contextDocs, systemPrompt, 'https://api.openai.com/v1');
    case 'deepseek':
      return queryOpenAICompatible(messages, config, contextDocs, systemPrompt, 'https://api.deepseek.com/v1');
    case 'groq':
      return queryOpenAICompatible(messages, config, contextDocs, systemPrompt, 'https://api.groq.com/openai/v1');
    case 'ollama':
      return queryOllama(messages, config, contextDocs, systemPrompt);
    case 'anthropic':
      return queryAnthropic(messages, config, contextDocs, systemPrompt);
    case 'openrouter':
      return queryOpenAICompatible(messages, config, contextDocs, systemPrompt, 'https://openrouter.ai/api/v1');
    case 'cerebras':
      return queryOpenAICompatible(messages, config, contextDocs, systemPrompt, 'https://api.cerebras.ai/v1');
    case 'github':
      return queryOpenAICompatible(messages, config, contextDocs, systemPrompt, 'https://models.inference.ai.azure.com/v1');
    case 'cloudflare':
      return queryCloudflare(messages, config, contextDocs, systemPrompt);
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}

async function queryGemini(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs?: string,
  systemPrompt?: string
): Promise<string> {
  const model = config.selectedModel || 'gemini-3.5-flash';
  const apiKey = config.apiKey || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GEMINI_API_KEY : '') || '';

  if (!apiKey) throw new Error('Gemini API key is required. Set GEMINI_API_KEY in .env or provider config.');

  const systemInstruction = systemPrompt
    ? { role: 'user', parts: [{ text: systemPrompt }] }
    : { role: 'user', parts: [{ text: 'You are a helpful research and knowledge assistant.' }] };

  const contextPart = contextDocs
    ? { role: 'user', parts: [{ text: `## Context Documents:\n${contextDocs}\n\nPlease reference these documents when answering.` }] }
    : null;

  const contents = [
    ...(contextPart ? [contextPart] : []),
    ...messages
      .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
      .map((m) => ({
        role: m.sender === MessageSender.USER ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
  ];

  const body: GeminiRequest & { system_instruction?: { parts: { text: string }[] } } = {
    contents,
    ...(systemPrompt ? { system_instruction: { parts: [{ text: systemPrompt }] } } : {}),
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: 8192,
      ...(config.enableThinking && config.thinkingLevel !== 'low'
        ? { thinkingConfig: { thinkingBudget: config.thinkingLevel === 'high' ? 24576 : 8192 } }
        : {}),
    },
    ...(config.enableSearchGrounding ? { tools: [{ google_search: {} }] } : {}),
  };

  const res = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}

async function queryOpenAICompatible(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs: string | undefined,
  systemPrompt: string | undefined,
  baseUrl: string
): Promise<string> {
  const apiKey = config.apiKey;
  if (!apiKey) throw new Error(`API key required for ${config.provider}.`);

  const model = config.selectedModel || 'gpt-4o-mini';

  const systemMsg = systemPrompt || 'You are a helpful research and knowledge assistant.';

  const chatMessages = [
    { role: 'system', content: systemMsg },
    ...(contextDocs ? [{ role: 'user', content: `## Context:\n${contextDocs}` }] : []),
    ...messages
      .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
      .map((m) => ({
        role: m.sender === MessageSender.USER ? 'user' : 'assistant',
        content: m.text,
      })),
  ];

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: config.temperature,
      max_tokens: config.maxTokens || 4096,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${config.provider} API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}

async function queryOllama(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs: string | undefined,
  systemPrompt: string | undefined
): Promise<string> {
  const baseUrl = config.customEndpoint || 'http://localhost:11434';
  const model = config.selectedModel || 'llama3';

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
        ...(contextDocs ? [{ role: 'user', content: `## Context:\n${contextDocs}` }] : []),
        ...messages
          .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
          .map((m) => ({
            role: m.sender === MessageSender.USER ? 'user' : 'assistant',
            content: m.text,
          })),
      ],
      stream: false,
      options: { temperature: config.temperature },
    }),
  });

  if (!res.ok) throw new Error(`Ollama API error: ${res.status}`);
  const data = await res.json();
  return data.message?.content || 'No response generated.';
}

async function queryAnthropic(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs: string | undefined,
  systemPrompt: string | undefined
): Promise<string> {
  const apiKey = config.apiKey;
  if (!apiKey) throw new Error('Anthropic API key required.');

  const model = config.selectedModel || 'claude-3-5-sonnet-latest';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt || 'You are a helpful research and knowledge assistant.',
      messages: [
        ...(contextDocs ? [{ role: 'user', content: `## Context:\n${contextDocs}` }] : []),
        ...messages
          .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
          .map((m) => ({
            role: m.sender === MessageSender.USER ? 'user' : 'assistant',
            content: m.text,
          })),
      ],
      max_tokens: config.maxTokens || 4096,
      temperature: config.temperature,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || 'No response generated.';
}

async function queryCloudflare(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs: string | undefined,
  systemPrompt: string | undefined
): Promise<string> {
  const apiKey = config.apiKey;
  if (!apiKey) throw new Error('Cloudflare API key required.');

  const accountId = config.customEndpoint?.split('/').pop() || '';
  const model = config.selectedModel || '@cf/meta/llama-3.3-70b-instruct';
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`;

  const chatMessages = [
    { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
    ...(contextDocs ? [{ role: 'user', content: `## Context:\n${contextDocs}` }] : []),
    ...messages
      .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
      .map((m) => ({
        role: m.sender === MessageSender.USER ? 'user' : 'assistant',
        content: m.text,
      })),
  ];

  try {
    const res = await fetch(`${baseUrl}/run/${model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ messages: chatMessages }),
    });
    if (!res.ok) throw new Error(`Cloudflare API error: ${res.status}`);
    const data = await res.json();
    return data.result?.response || data.result?.content || 'No response generated.';
  } catch (err) {
    try {
      const openaiBase = 'https://api.cloudflare.com/client/v4/accounts';
      return queryOpenAICompatible(messages, { ...config, customEndpoint: undefined }, contextDocs, systemPrompt, `${openaiBase}/${accountId}/ai/v1`);
    } catch {
      throw err;
    }
  }
}

/* ─── Streaming ─── */

async function* streamOpenAICompatible(
  messages: ChatMessage[],
  config: ProviderConfig,
  baseUrl: string,
  contextDocs?: string,
  systemPrompt?: string,
): AsyncGenerator<string> {
  const apiKey = config.apiKey;
  if (!apiKey) throw new Error(`API key required for ${config.provider}.`);
  const model = config.selectedModel || 'gpt-4o-mini';

  const chatMessages = [
    { role: 'system', content: systemPrompt || 'You are a helpful research and knowledge assistant.' },
    ...(contextDocs ? [{ role: 'user', content: `## Context:\n${contextDocs}` }] : []),
    ...messages
      .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
      .map((m) => ({
        role: m.sender === MessageSender.USER ? 'user' : 'assistant',
        content: m.text,
      })),
  ];

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: config.temperature,
      max_tokens: config.maxTokens || 4096,
      stream: true,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${config.provider} API error (${res.status}): ${errText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body for streaming');
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content || '';
        if (content) yield content;
      } catch { /* skip malformed chunk */ }
    }
  }
}

async function* streamGemini(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs?: string,
  systemPrompt?: string,
): AsyncGenerator<string> {
  const model = config.selectedModel || 'gemini-3.5-flash';
  const apiKey = config.apiKey || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GEMINI_API_KEY : '') || '';
  if (!apiKey) throw new Error('Gemini API key required.');

  const systemInstruction = systemPrompt
    ? { role: 'system', parts: [{ text: systemPrompt }] }
    : { role: 'system', parts: [{ text: 'You are a helpful research and knowledge assistant.' }] };

  const contextPart = contextDocs
    ? { role: 'user', parts: [{ text: `## Context Documents:\n${contextDocs}\n\nPlease reference these documents when answering.` }] }
    : null;

  const contents = [
    contextPart,
    ...messages
      .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
      .map((m) => ({
        role: m.sender === MessageSender.USER ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
  ].filter(Boolean);

  const body = {
    contents,
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: 8192,
    },
  };

  const res = await fetch(`${GEMINI_API_BASE}/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      try {
        const parsed = JSON.parse(trimmed.slice(6));
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) yield text;
      } catch { /* skip */ }
    }
  }
}

async function* streamAnthropic(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs?: string,
  systemPrompt?: string,
): AsyncGenerator<string> {
  const apiKey = config.apiKey;
  if (!apiKey) throw new Error('Anthropic API key required.');
  const model = config.selectedModel || 'claude-3-5-sonnet-latest';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt || 'You are a helpful research and knowledge assistant.',
      messages: [
        ...(contextDocs ? [{ role: 'user', content: `## Context:\n${contextDocs}` }] : []),
        ...messages
          .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
          .map((m) => ({
            role: m.sender === MessageSender.USER ? 'user' : 'assistant',
            content: m.text,
          })),
      ],
      max_tokens: config.maxTokens || 4096,
      stream: true,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      try {
        const parsed = JSON.parse(trimmed.slice(6));
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          yield parsed.delta.text;
        }
      } catch { /* skip */ }
    }
  }
}

async function* streamOllama(
  messages: ChatMessage[],
  config: ProviderConfig,
  contextDocs?: string,
  systemPrompt?: string,
): AsyncGenerator<string> {
  const baseUrl = config.customEndpoint || 'http://localhost:11434';
  const model = config.selectedModel || 'llama3';

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
        ...(contextDocs ? [{ role: 'user', content: `## Context:\n${contextDocs}` }] : []),
        ...messages
          .filter((m) => m.sender !== MessageSender.SYSTEM && !m.isLoading)
          .map((m) => ({
            role: m.sender === MessageSender.USER ? 'user' : 'assistant',
            content: m.text,
          })),
      ],
      stream: true,
      options: { temperature: config.temperature },
    }),
  });

  if (!res.ok) throw new Error(`Ollama API error: ${res.status}`);
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.done) return;
        if (parsed.message?.content) yield parsed.message.content;
      } catch { /* skip */ }
    }
  }
}

export async function queryLLMStream(
  messages: ChatMessage[],
  config: ProviderConfig,
  onChunk: (text: string) => void,
  contextDocs?: string,
  systemPrompt?: string,
): Promise<string> {
  let fullText = '';

  const providerStreamMap: Record<string, () => AsyncGenerator<string>> = {
    gemini: () => streamGemini(messages, config, contextDocs, systemPrompt),
    openai: () => streamOpenAICompatible(messages, config, 'https://api.openai.com/v1', contextDocs, systemPrompt),
    deepseek: () => streamOpenAICompatible(messages, config, 'https://api.deepseek.com/v1', contextDocs, systemPrompt),
    groq: () => streamOpenAICompatible(messages, config, 'https://api.groq.com/openai/v1', contextDocs, systemPrompt),
    openrouter: () => streamOpenAICompatible(messages, config, 'https://openrouter.ai/api/v1', contextDocs, systemPrompt),
    cerebras: () => streamOpenAICompatible(messages, config, 'https://api.cerebras.ai/v1', contextDocs, systemPrompt),
    github: () => streamOpenAICompatible(messages, config, 'https://models.inference.ai.azure.com/v1', contextDocs, systemPrompt),
    cloudflare: () => streamOpenAICompatible(messages, config, 'https://api.cloudflare.com/client/v4/accounts', contextDocs, systemPrompt),
    anthropic: () => streamAnthropic(messages, config, contextDocs, systemPrompt),
    ollama: () => streamOllama(messages, config, contextDocs, systemPrompt),
  };

  const streamFn = providerStreamMap[config.provider];
  if (!streamFn) {
    throw new Error(`Streaming not supported for provider: ${config.provider}`);
  }

  for await (const chunk of streamFn()) {
    fullText += chunk;
    onChunk(chunk);
  }

  return fullText;
}

/* ─── A2A Multi-Agent Debate ─── */
function buildAgentConfig(baseConfig: ProviderConfig, agent: Partial<A2AAgent>): ProviderConfig {
  if (agent.provider && agent.modelName) {
    return { ...baseConfig, provider: agent.provider, selectedModel: agent.modelName };
  }
  return baseConfig;
}

export async function runA2ADebate(
  topic: string,
  agents: (Partial<A2AAgent> & { name: string; systemPrompt: string; color: string; avatar: string })[],
  config: ProviderConfig,
  contextDocs?: string,
  onAgentResponse?: (agentName: string, response: string, latency: number) => void
): Promise<string[]> {
  const responses: string[] = [];

  for (const agent of agents) {
    const start = Date.now();
    const agentCfg = buildAgentConfig(config, agent);
    try {
      const response = await queryLLM(
        [{ id: '1', text: topic, sender: MessageSender.USER, timestamp: new Date() }],
        agentCfg,
        contextDocs,
        agent.systemPrompt
      );
      const latency = Date.now() - start;
      responses.push(response);
      onAgentResponse?.(agent.name, response, latency);
    } catch (err) {
      const latency = Date.now() - start;
      responses.push(`[Error from ${agent.name}: ${(err as Error).message}]`);
      onAgentResponse?.(agent.name, `Error: ${(err as Error).message}`, latency);
    }
  }

  // Synthesis pass
  const debateSummary = await queryLLM(
    [{ id: 'debate', text: `Summarize this multi-agent debate and provide a consensus recommendation:\n\n${responses.map((r, i) => `### ${agents[i].name}:\n${r}`).join('\n\n')}`, sender: MessageSender.USER, timestamp: new Date() }],
    config,
    contextDocs,
    'You are a consensus facilitator. Synthesize multiple expert opinions into a unified recommendation.'
  );

  return [...responses, debateSummary];
}

/* ─── Initial Suggestions ─── */
export async function getInitialSuggestions(config: ProviderConfig): Promise<string[]> {
  try {
    const response = await queryLLM(
      [{ id: '1', text: 'Generate 5 diverse research questions a health program manager might explore using knowledge documents. Return only the questions, numbered.', sender: MessageSender.USER, timestamp: new Date() }],
      config,
      undefined,
      'You are a research brainstorming assistant. Be specific and actionable.'
    );
    return response.split('\n').filter((l) => l.trim()).slice(0, 5);
  } catch {
    return [];
  }
}

/* ─── Feature 1: Orchestrated Workflow ─── */

interface TaskDecomposition {
  agentId: string;
  subTask: string;
  rationale: string;
}

async function decomposeTask(
  topic: string,
  agents: (Partial<A2AAgent> & { id: string; name: string; role: string; systemPrompt: string })[],
  config: ProviderConfig,
  contextDocs?: string
): Promise<TaskDecomposition[]> {
  const agentDescriptions = agents
    .filter((a) => a.id !== 'coord')
    .map((a) => `- ${a.id}: ${a.name} — ${a.role}`)
    .join('\n');

  const prompt = `Analyze the following user request and decompose it into sub-tasks for specialized agents.

Available agents:
${agentDescriptions}

User request: "${topic}"

For each sub-task, specify which agent should handle it and what exactly they should do. 
Return ONLY a JSON array of objects with fields: agentId, subTask, rationale.
Example: [{"agentId":"research","subTask":"Find the latest R0 values for measles","rationale":"The researcher specializes in finding and synthesizing information"}]`;

  const decompositionText = await queryLLM(
    [{ id: 'decomp', text: prompt, sender: MessageSender.USER, timestamp: new Date() }],
    config,
    contextDocs,
    'You are a workflow orchestrator. Decompose tasks precisely. Return ONLY valid JSON arrays.'
  );

  try {
    const parsed = JSON.parse(decompositionText.replace(/```json|```/g, '').trim());
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return agents
      .filter((a) => a.id !== 'coord')
      .slice(0, 3)
      .map((a) => ({ agentId: a.id, subTask: topic, rationale: 'Auto-assigned' }));
  }
}

export async function runOrchestratedWorkflow(
  topic: string,
  agents: (Partial<A2AAgent> & { id: string; name: string; role: string; systemPrompt: string; color: string; avatar: string })[],
  config: ProviderConfig,
  contextDocs?: string,
  onAgentResponse?: (agentName: string, response: string, latency: number) => void
): Promise<string> {
  const agentMap = new Map(agents.map((a) => [a.id, a]));
  const coordinator = agents.find((a) => a.id === 'coord');

  // Step 1: Coordinator decomposes the task
  const decomposition = await decomposeTask(topic, agents, config, contextDocs);
  if (!decomposition.length) {
    const responses = await runA2ADebate(topic, agents, config, contextDocs, onAgentResponse);
    return responses.join('\n\n');
  }

  // Step 2: Execute sub-tasks sequentially
  const subResults: { agentId: string; name: string; response: string }[] = [];
  for (const step of decomposition) {
    const agent = agentMap.get(step.agentId);
    if (!agent) continue;
    const agentCfg = buildAgentConfig(config, agent);

    const start = Date.now();
    const agentPrompt = `You are assigned the following sub-task:\n${step.subTask}\n\nRationale: ${step.rationale}\n\nOriginal request: ${topic}`;

    try {
      const response = await queryLLM(
        [{ id: step.agentId, text: agentPrompt, sender: MessageSender.USER, timestamp: new Date() }],
        agentCfg,
        contextDocs,
        agent.systemPrompt
      );
      const latency = Date.now() - start;
      subResults.push({ agentId: step.agentId, name: agent.name, response });
      onAgentResponse?.(agent.name, response, latency);
    } catch (err) {
      subResults.push({ agentId: step.agentId, name: agent.name, response: `[Error: ${(err as Error).message}]` });
    }
  }

  // Step 3: Coordinator synthesizes
  if (!coordinator) return subResults.map((r) => `### ${r.name}\n${r.response}`).join('\n\n');
  const coordCfg = buildAgentConfig(config, coordinator);

  const synthesisPrompt = `Original request: "${topic}"\n\nAgent results:\n${subResults.map((r) => `### ${r.name}\n${r.response}`).join('\n\n')}\n\nSynthesize these findings into a comprehensive, well-structured final response. Integrate all contributions, resolve contradictions, and provide a cohesive answer.`;

  const finalResponse = await queryLLM(
    [{ id: 'synth', text: synthesisPrompt, sender: MessageSender.USER, timestamp: new Date() }],
    coordCfg,
    contextDocs,
    coordinator.systemPrompt
  );

  return `## Orchestrated Workflow: ${topic}\n\n${subResults.map((r) => `### ${r.name}\n${r.response}`).join('\n\n')}\n\n## Synthesis\n${finalResponse}`;
}

/* ─── Feature 2: Sequential A2A Workflow ─── */

export async function runSequentialWorkflow(
  topic: string,
  chain: (Partial<A2AAgent> & { agentId: string; name: string; systemPrompt: string })[],
  config: ProviderConfig,
  contextDocs?: string,
  onStepComplete?: (agentName: string, response: string, latency: number) => void
): Promise<string> {
  let accumulatedContext = topic;
  const stepResults: { name: string; response: string }[] = [];

  for (const step of chain) {
    const start = Date.now();
    const stepCfg = buildAgentConfig(config, step);
    const prompt = `Previous context:\n${accumulatedContext}\n\nContinue the workflow. Build upon what the previous agents have produced.`;

    try {
      const response = await queryLLM(
        [{ id: step.agentId, text: prompt, sender: MessageSender.USER, timestamp: new Date() }],
        stepCfg,
        contextDocs,
        step.systemPrompt
      );
      const latency = Date.now() - start;
      stepResults.push({ name: step.name, response });
      onStepComplete?.(step.name, response, latency);
      accumulatedContext += `\n\n### ${step.name} Output:\n${response}`;
    } catch (err) {
      stepResults.push({ name: step.name, response: `[Error: ${(err as Error).message}]` });
    }
  }

  return `## Sequential Workflow: ${topic}\n\n${stepResults.map((r) => `### ${r.name}\n${r.response}`).join('\n\n')}`;
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { queryLLM } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { MessageSender } from '../types';

function mockResponse(data: any, status = 200) {
  return vi.mocked(fetch).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);
}

const baseMessages: ChatMessage[] = [
  { id: '1', text: 'Hello', sender: MessageSender.USER, timestamp: new Date() },
];

const geminiConfig = { provider: 'gemini' as const, apiKey: 'gk-test', selectedModel: 'gemini-3.5-flash', temperature: 0.7, enableThinking: false, thinkingLevel: 'low' as const, enableSearchGrounding: false, enableMapsGrounding: false };
const openaiConfig = { provider: 'openai' as const, apiKey: 'sk-test', selectedModel: 'gpt-4o', temperature: 0.7, enableThinking: false, thinkingLevel: 'low' as const, enableSearchGrounding: false, enableMapsGrounding: false };
const anthropicConfig = { provider: 'anthropic' as const, apiKey: 'sk-ant-test', selectedModel: 'claude-3-5-sonnet-20241022', temperature: 0.7, enableThinking: false, thinkingLevel: 'low' as const, enableSearchGrounding: false, enableMapsGrounding: false };
const deepseekConfig = { provider: 'deepseek' as const, apiKey: 'ds-test', selectedModel: 'deepseek-chat', temperature: 0.7, enableThinking: false, thinkingLevel: 'low' as const, enableSearchGrounding: false, enableMapsGrounding: false };
const groqConfig = { provider: 'groq' as const, apiKey: 'groq-test', selectedModel: 'mixtral-8x7b-32768', temperature: 0.7, enableThinking: false, thinkingLevel: 'low' as const, enableSearchGrounding: false, enableMapsGrounding: false };
const ollamaConfig = { provider: 'ollama' as const, apiKey: '', selectedModel: 'llama3', temperature: 0.7, enableThinking: false, thinkingLevel: 'low' as const, enableSearchGrounding: false, enableMapsGrounding: false };
const openrouterConfig = { provider: 'openrouter' as const, apiKey: 'or-test', selectedModel: 'openai/gpt-4o', temperature: 0.7, enableThinking: false, thinkingLevel: 'low' as const, enableSearchGrounding: false, enableMapsGrounding: false };

describe('queryLLM multi-provider routing', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Mock' }] } }] })))
    );
  });

  describe('Gemini provider', () => {
    it('routes to Gemini API and returns text', async () => {
      mockResponse({ candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }] });
      const result = await queryLLM(baseMessages, geminiConfig);
      expect(result).toBe('Gemini response');
    });

    it('includes thinking config when enabled', async () => {
      const configWithThinking = { ...geminiConfig, enableThinking: true, thinkingLevel: 'high' as const };
      mockResponse({ candidates: [{ content: { parts: [{ text: 'Thinking response' }] } }] });
      await queryLLM(baseMessages, configWithThinking);
      const body = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as any).body);
      expect(body.generationConfig.thinkingConfig).toBeDefined();
      expect(body.generationConfig.thinkingConfig.thinkingBudget).toBe(24576);
    });

    it('includes search grounding when enabled', async () => {
      const configWithGrounding = { ...geminiConfig, enableSearchGrounding: true };
      mockResponse({ candidates: [{ content: { parts: [{ text: 'Search response' }] } }] });
      await queryLLM(baseMessages, configWithGrounding);
      const body = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as any).body);
      expect(body.tools).toBeDefined();
      expect(body.tools[0].google_search).toBeDefined();
    });
  });

  describe('OpenAI provider', () => {
    it('routes to OpenAI API', async () => {
      mockResponse({ choices: [{ message: { content: 'OpenAI response' } }] });
      const result = await queryLLM(baseMessages, openaiConfig);
      expect(result).toBe('OpenAI response');
      const url = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(url).toContain('api.openai.com');
    });
  });

  describe('Anthropic provider', () => {
    it('routes to Anthropic API', async () => {
      mockResponse({ content: [{ text: 'Anthropic response' }] });
      const result = await queryLLM(baseMessages, anthropicConfig);
      expect(result).toBe('Anthropic response');
      const url = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(url).toContain('api.anthropic.com');
    });
  });

  describe('DeepSeek provider', () => {
    it('routes to DeepSeek API', async () => {
      mockResponse({ choices: [{ message: { content: 'DeepSeek response' } }] });
      const result = await queryLLM(baseMessages, deepseekConfig);
      expect(result).toBe('DeepSeek response');
      const url = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(url).toContain('api.deepseek.com');
    });
  });

  describe('Groq provider', () => {
    it('routes to Groq API', async () => {
      mockResponse({ choices: [{ message: { content: 'Groq response' } }] });
      const result = await queryLLM(baseMessages, groqConfig);
      expect(result).toBe('Groq response');
      const url = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(url).toContain('api.groq.com');
    });
  });

  describe('Ollama provider', () => {
    it('routes to Ollama API', async () => {
      mockResponse({ message: { content: 'Ollama response' } });
      const result = await queryLLM(baseMessages, ollamaConfig);
      expect(result).toBe('Ollama response');
      const url = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(url).toContain('localhost:11434');
    });
  });

  describe('OpenRouter provider', () => {
    it('routes to OpenRouter API', async () => {
      mockResponse({ choices: [{ message: { content: 'OpenRouter response' } }] });
      const result = await queryLLM(baseMessages, openrouterConfig);
      expect(result).toBe('OpenRouter response');
      const url = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(url).toContain('openrouter.ai');
    });
  });

  describe('Error handling', () => {
    it('throws error for unsupported provider', async () => {
      await expect(queryLLM(baseMessages, { ...geminiConfig, provider: 'unknown' as any })).rejects.toThrow('Unsupported provider');
    });
  });

  describe('Streaming (queryLLMStream)', async () => {
    it('exists and is a function', async () => {
      const { queryLLMStream } = await import('../services/geminiService');
      expect(typeof queryLLMStream).toBe('function');
    });
  });
});

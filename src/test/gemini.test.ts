import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runOrchestratedWorkflow, runSequentialWorkflow } from '../services/geminiService';

const mockAgents = [
  { id: 'coord', name: 'Coordinator', role: 'Synthesis', systemPrompt: 'You synthesize.', color: '#6366f1', avatar: 'C' },
  { id: 'research', name: 'Researcher', role: 'Research', systemPrompt: 'You research.', color: '#22c55e', avatar: 'R' },
  { id: 'writer', name: 'Writer', role: 'Writing', systemPrompt: 'You write.', color: '#f59e0b', avatar: 'W' },
];

const mockConfig = {
  provider: 'gemini' as const,
  apiKey: 'test-key',
  selectedModel: 'gemini-3.5-flash',
  temperature: 0.7,
  enableThinking: false,
  thinkingLevel: 'low' as const,
  enableSearchGrounding: false,
  enableMapsGrounding: false,
};

function mockFetchOnce(responseText: string, status = 200) {
  return vi.mocked(fetch).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(responseText),
    text: () => Promise.resolve(typeof responseText === 'string' ? responseText : JSON.stringify(responseText)),
  } as Response);
}

function mockGeminiResponse(text: string) {
  return mockFetchOnce(JSON.stringify({
    candidates: [{ content: { parts: [{ text }] } }],
  }));
}

describe('runOrchestratedWorkflow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Mock response' }] } }] })))
    );
  });

  it('calls agents in sequence for a valid decomposition', async () => {
    vi.mocked(fetch)
      .mockReset()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify([
          { agentId: 'research', subTask: 'Find incidence rates', rationale: 'Researcher specializes in data' },
          { agentId: 'writer', subTask: 'Write summary', rationale: 'Writer specializes in prose' },
        ]) }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Research output' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Writer output' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Synthesis output' }] } }],
      })));

    const result = await runOrchestratedWorkflow('Test topic', mockAgents, mockConfig);

    expect(fetch).toHaveBeenCalledTimes(4);
    expect(result).toContain('Research output');
    expect(result).toContain('Writer output');
    expect(result).toContain('Synthesis output');
  });

  it('handles empty agent results gracefully', async () => {
    vi.mocked(fetch)
      .mockReset()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify([]) }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Debate response 1' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Debate response 2' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Debate response 3' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Synthesis response' }] } }],
      })));

    const result = await runOrchestratedWorkflow('Empty topic', mockAgents, mockConfig);

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('falls back to simple debate when decomposition fails', async () => {
    vi.mocked(fetch)
      .mockReset()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'INVALID JSON' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Debate agent 1' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Debate agent 2' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Debate agent 3' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Debate synthesis' }] } }],
      })));

    const result = await runOrchestratedWorkflow('Fallback topic', mockAgents, mockConfig);

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('calls onAgentResponse callback with correct data', async () => {
    vi.mocked(fetch)
      .mockReset()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify([
          { agentId: 'research', subTask: 'Research task', rationale: 'Testing' },
        ]) }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Research output' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Synthesis output' }] } }],
      })));

    const onAgentResponse = vi.fn();
    await runOrchestratedWorkflow('Test callback', mockAgents, mockConfig, undefined, onAgentResponse);

    expect(onAgentResponse).toHaveBeenCalledTimes(1);
    expect(onAgentResponse).toHaveBeenCalledWith('Researcher', 'Research output', expect.any(Number));
  });
});

describe('runSequentialWorkflow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Mock response' }] } }] })))
    );
  });

  it('chains agents sequentially, accumulating context', async () => {
    vi.mocked(fetch)
      .mockReset()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'First agent output' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Second agent output' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Third agent output' }] } }],
      })));

    const chain = [
      { agentId: 'research', name: 'Researcher', systemPrompt: 'Research prompt' },
      { agentId: 'writer', name: 'Writer', systemPrompt: 'Write prompt' },
      { agentId: 'reviewer', name: 'Reviewer', systemPrompt: 'Review prompt' },
    ];

    const result = await runSequentialWorkflow('Sequential topic', chain, mockConfig);

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(result).toContain('First agent output');
    expect(result).toContain('Second agent output');
    expect(result).toContain('Third agent output');
  });

  it('accumulates context across steps', async () => {
    const capturedBodies: string[] = [];
    vi.mocked(fetch)
      .mockReset()
      .mockImplementation(async (_url, options) => {
        capturedBodies.push(options?.body ? JSON.parse(options.body as string) : '');
        return new Response(JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'Agent output' }] } }],
        }));
      });

    const chain = [
      { agentId: 'a1', name: 'Agent1', systemPrompt: 'Prompt1' },
      { agentId: 'a2', name: 'Agent2', systemPrompt: 'Prompt2' },
    ];

    await runSequentialWorkflow('Initial topic', chain, mockConfig);

    expect(capturedBodies.length).toBe(2);
  });

  it('handles errors in a single step without crashing', async () => {
    vi.mocked(fetch)
      .mockReset()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'First output' }] } }],
      })))
      .mockResolvedValueOnce(new Response(null, { status: 500, statusText: 'Server Error' }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Third output' }] } }],
      })));

    const chain = [
      { agentId: 'a1', name: 'Agent1', systemPrompt: 'P1' },
      { agentId: 'a2', name: 'Agent2', systemPrompt: 'P2' },
      { agentId: 'a3', name: 'Agent3', systemPrompt: 'P3' },
    ];

    const result = await runSequentialWorkflow('Error topic', chain, mockConfig);

    expect(result).toContain('First output');
    expect(result).toContain('Error');
    expect(result).toContain('Third output');
  });

  it('calls onStepComplete callback', async () => {
    vi.mocked(fetch)
      .mockReset()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Step 1' }] } }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Step 2' }] } }],
      })));

    const onStepComplete = vi.fn();
    const chain = [
      { agentId: 'a1', name: 'Agent1', systemPrompt: 'P1' },
      { agentId: 'a2', name: 'Agent2', systemPrompt: 'P2' },
    ];

    await runSequentialWorkflow('Callback topic', chain, mockConfig, undefined, onStepComplete);

    expect(onStepComplete).toHaveBeenCalledTimes(2);
    expect(onStepComplete).toHaveBeenNthCalledWith(1, 'Agent1', 'Step 1', expect.any(Number));
    expect(onStepComplete).toHaveBeenNthCalledWith(2, 'Agent2', 'Step 2', expect.any(Number));
  });
});

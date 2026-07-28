import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageSender, ProviderConfig, KBFile, MCPServer } from '../types';
import { queryLLM, queryLLMStream, getInitialSuggestions } from '../services/geminiService';
import { parse, sanitizeOutput } from '../utils/markdown';
import { Send, Mic, MicOff, Sparkles, Loader2, Download, Bold, Italic, Code, Link, List, Heading } from './icons/lucide-shim';
import { executeMCPTool, buildActiveToolsContext, parseToolCall } from '../services/mcpService';

interface Props {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  providerConfig: ProviderConfig;
  files: KBFile[];
  mcpServers: MCPServer[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  initialSuggestions: string[];
  isFetchingSuggestions: boolean;
  setIsFetchingSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setInitialSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  onMessageSent?: (text: string, sender: string) => void;
}

const ChatInterface: React.FC<Props> = ({
  messages, setMessages, providerConfig, files, mcpServers, isLoading, setIsLoading,
  initialSuggestions, isFetchingSuggestions, setIsFetchingSuggestions, setInitialSuggestions,
  onMessageSent,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [turnDepth, setTurnDepth] = useState(10);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const chatContainer = chatEndRef.current?.parentElement;
      if (!chatContainer) return;
      chatContainer.querySelectorAll('.katex-math').forEach((el) => {
        const math = el.getAttribute('data-math');
        if (math && (window as any).katex) {
          try { (window as any).katex.render(math, el as HTMLElement, { displayMode: true, throwOnError: false }); }
          catch {}
        }
      });
      chatContainer.querySelectorAll('.katex-inline').forEach((el) => {
        const math = el.getAttribute('data-math');
        if (math && (window as any).katex) {
          try { (window as any).katex.render(math, el as HTMLElement, { displayMode: false, throwOnError: false }); }
          catch {}
        }
      });
      chatContainer.querySelectorAll('.language-mermaid').forEach((el) => {
        const pre = el.closest('pre');
        if (pre && (window as any).mermaid) {
          try {
            const uid = 'mermaid-' + crypto.randomUUID().slice(0, 8);
            const svg = document.createElement('div');
            svg.id = uid;
            svg.className = 'mermaid';
            svg.textContent = el.textContent || '';
            pre.replaceWith(svg);
            (window as any).mermaid.run({ nodes: [svg] });
          } catch {}
        }
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && initialSuggestions.length === 0) {
      setIsFetchingSuggestions(true);
      getInitialSuggestions(providerConfig).then((suggestions) => {
        setInitialSuggestions(suggestions);
        setIsFetchingSuggestions(false);
      }).catch(() => setIsFetchingSuggestions(false));
    }
  }, [providerConfig]);

  const wrapSelection = (before: string, after: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = input.substring(start, end);
    const newText = input.substring(0, start) + before + selected + after + input.substring(end);
    setInput(newText);
    const cursorPos = start + before.length + selected.length + after.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const insertAtCursor = (text: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const newText = input.substring(0, start) + text + input.substring(el.selectionEnd);
    setInput(newText);
    const cursorPos = start + text.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const getContextDocs = useCallback(() => {
    const activeFiles = files.filter((f) => f.isActive);
    if (activeFiles.length === 0) return undefined;
    return activeFiles.map((f) => `### ${f.name}\n${f.content}`).join('\n\n');
  }, [files]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: messageText,
      sender: MessageSender.USER,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    inputRef.current?.focus();
    setIsLoading(true);
    onMessageSent?.(messageText, 'user');

    const loadingMsg: ChatMessage = {
      id: `loading-${Date.now()}`,
      text: '',
      sender: MessageSender.MODEL,
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    const toolContext = buildActiveToolsContext(mcpServers);
    const mergedContext = [toolContext, getContextDocs()].filter(Boolean).join('\n\n');
    const recentMessages = messages.slice(-turnDepth);

    const doStreamQuery = async (queryMessages: ChatMessage[], msgId: string): Promise<string> => {
      let accumulated = '';
      await queryLLMStream(queryMessages, providerConfig, (chunk) => {
        accumulated += chunk;
        setMessages((prev) => prev.map((m) =>
          m.id === msgId ? { ...m, text: accumulated, isLoading: false, provider: providerConfig.provider, modelName: providerConfig.selectedModel } : m
        ));
      }, mergedContext);
      return accumulated;
    };

    try {
      let lastMsgId = loadingMsg.id;
      let responseText = '';
      let maxToolLoops = 5;

      while (maxToolLoops-- > 0) {
        responseText = await doStreamQuery(
          [...recentMessages, ...messages.filter((m) => m.id.startsWith('tool-result-')).slice(-4)],
          lastMsgId,
        );

        const toolCall = parseToolCall(responseText);
        if (!toolCall) break;

        const activeTools = mcpServers.flatMap((s) =>
          s.tools.filter((t) => t.isActive).map((t) => ({ server: s, tool: t }))
        );
        const match = activeTools.find((t) => t.tool.name === toolCall.toolName);
        if (!match) {
          setMessages((prev) => [...prev, {
            id: `tool-error-${Date.now()}`, text: `Unknown tool: ${toolCall.toolName}. Available tools: ${activeTools.map((t) => t.tool.name).join(', ')}`,
            sender: MessageSender.SYSTEM, timestamp: new Date(),
          }]);
          break;
        }

        const toolResult = await executeMCPTool(match.server, match.tool, toolCall.params);
        const resultMsg: ChatMessage = {
          id: `tool-result-${Date.now()}`, text: `**Tool: ${toolCall.toolName}**\n\`\`\`json\n${JSON.stringify(toolResult.data ?? { error: toolResult.error }, null, 2).slice(0, 3000)}\n\`\`\``,
          sender: MessageSender.SYSTEM, timestamp: new Date(),
        };
        setMessages((prev) => [...prev, resultMsg]);

        lastMsgId = `loading-${Date.now()}`;
        setMessages((prev) => [...prev, {
          id: lastMsgId, text: '', sender: MessageSender.MODEL, timestamp: new Date(), isLoading: true,
        }]);
      }
    } catch (err) {
      setMessages((prev) => prev.map((m) =>
        m.id === loadingMsg.id ? { ...m, text: `Error: ${(err as Error).message}`, isLoading: false } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExportMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportAsMarkdown = () => {
    const date = new Date().toISOString().slice(0, 10);
    const header = `# Chat Export\n**Date:** ${date}\n**Provider:** ${providerConfig.provider}\n**Model:** ${providerConfig.selectedModel}\n\n---\n`;
    const body = messages.filter((m) => !m.isLoading).map((m) => {
      const role = m.sender === MessageSender.USER ? '**You**' : `**Assistant**${m.modelName ? ` (${m.modelName})` : ''}`;
      return `### ${role}\n${m.text || '*Empty*'}\n`;
    }).join('\n\n');
    downloadFile(header + body, `chat-${date}.md`, 'text/markdown');
    setShowExportMenu(false);
  };

  const exportAsJSON = () => {
    const date = new Date().toISOString().slice(0, 10);
    const data = {
      exportedAt: new Date().toISOString(),
      provider: providerConfig.provider,
      model: providerConfig.selectedModel,
      messages: messages.filter((m) => !m.isLoading).map((m) => ({
        sender: m.sender === MessageSender.USER ? 'user' : 'assistant',
        text: m.text,
        timestamp: m.timestamp.toISOString(),
        modelName: m.modelName || undefined,
      })),
    };
    downloadFile(JSON.stringify(data, null, 2), `chat-${date}.json`, 'application/json');
    setShowExportMenu(false);
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExportMenu = () => setShowExportMenu((prev) => !prev);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Sparkles size={18} color="var(--accent)" />
          <span className="text-sm font-medium">AI Chat</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">{providerConfig.selectedModel}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--text-secondary)]">Context turns:</label>
          <input type="range" min={2} max={30} value={turnDepth} onChange={(e) => setTurnDepth(Number(e.target.value))} className="w-20 h-1 accent-[var(--accent)]" />
          <span className="text-xs text-[var(--text-muted)] w-4">{turnDepth}</span>
          <div className="relative" ref={exportRef}>
            <button onClick={toggleExportMenu} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Export chat" aria-label="Export chat" aria-expanded={showExportMenu}><Download size={14} /></button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-xl z-10 py-1">
                <button onClick={exportAsMarkdown} className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--bg-hover)]">Export as Markdown</button>
                <button onClick={exportAsJSON} className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--bg-hover)]">Export as JSON</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-container px-4 py-3 space-y-4">
        {messages.length === 0 && initialSuggestions.length > 0 && !isRecording && (
          <div className="space-y-3 mt-8">
            <p className="text-sm text-[var(--text-secondary)]">Try asking:</p>
            {initialSuggestions.map((s, i) => (
              <button key={i} onClick={() => handleSend(s)} className="block w-full text-left p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/50 text-sm transition-colors">
                {s}
              </button>
            ))}
            {isFetchingSuggestions && <p className="text-xs text-[var(--text-muted)]">Loading suggestions...</p>}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
              msg.sender === MessageSender.USER
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]'
            }`}>
              {msg.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              ) : (
                <div
                  className="text-sm prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeOutput(
                      msg.sender === MessageSender.MODEL && !msg.isLoading
                        ? parse(msg.text)
                        : msg.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
                    )
                  }}
                />
              )}
              {msg.modelName && !msg.isLoading && (
                <div className="text-[10px] text-[var(--text-muted)] mt-1">{msg.modelName}</div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-1 mb-1.5">
          <button onClick={() => wrapSelection('**', '**')} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Bold"><Bold size={14} /></button>
          <button onClick={() => wrapSelection('*', '*')} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Italic"><Italic size={14} /></button>
          <button onClick={() => wrapSelection('`', '`')} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Inline code"><Code size={14} /></button>
          <button onClick={() => wrapSelection('[', '](url)')} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Link"><Link size={14} /></button>
          <button onClick={() => insertAtCursor('- ')} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="List item"><List size={14} /></button>
          <button onClick={() => insertAtCursor('## ')} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Heading"><Heading size={14} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-red-500/20 text-red-400 voice-recording' : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'}`}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                handleSend();
              }
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]/50 placeholder-gray-500 resize-none"
            style={{ minHeight: '36px', maxHeight: '120px' }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-dark)] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        {files.filter((f) => f.isActive).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-[10px] text-[var(--text-muted)]">Active context:</span>
            {files.filter((f) => f.isActive).map((f) => (
              <span key={f.id} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-subtler)] text-[var(--accent)]">{f.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;

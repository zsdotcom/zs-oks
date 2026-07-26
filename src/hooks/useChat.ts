import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { ChatMessage, ChatSession, ProviderConfig } from '../types';
import { dbGetAll, dbPut, dbDelete } from '../db/indexedDB';

const CURRENT_SESSION_KEY = 'current-session';

export function useChat(providerConfig: ProviderConfig) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [initialSuggestions, setInitialSuggestions] = useState<string[]>([]);

  useEffect(() => {
    dbGetAll<ChatSession>('sessions').then((loaded) => {
      if (loaded.length > 0) {
        setSessions(loaded);
        const last = loaded[loaded.length - 1];
        setActiveSessionId(last.id);
        setMessages(last.messages);
      }
    }).catch(() => {});
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      setMessages(session.messages);
    }
  }, [sessions]);

  const createSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: `Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      provider: providerConfig.provider,
      modelName: providerConfig.selectedModel,
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    setMessages([]);
    dbPut('sessions', newSession).catch(() => {});
    return newSession.id;
  }, [sessions.length, providerConfig]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter((s) => s.id !== sessionId);
      if (remaining.length > 0) {
        const last = remaining[remaining.length - 1];
        setActiveSessionId(last.id);
        setMessages(last.messages);
      } else {
        setActiveSessionId(null);
        setMessages([]);
      }
    }
    dbDelete('sessions', sessionId).catch(() => {});
  }, [activeSessionId, sessions]);

  const setMessagesWrapper: Dispatch<SetStateAction<ChatMessage[]>> = useCallback((action) => {
    setMessages((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      if (activeSessionId) {
        setSessions((prevSessions) => {
          const updated = prevSessions.map((s) =>
            s.id === activeSessionId ? { ...s, messages: next } : s
          );
          const session = updated.find((s) => s.id === activeSessionId);
          if (session) dbPut('sessions', session).catch(() => {});
          return updated;
        });
      }
      return next;
    });
  }, [activeSessionId]);

  return {
    sessions, activeSessionId, messages, isLoading, setIsLoading,
    isFetchingSuggestions, setIsFetchingSuggestions,
    initialSuggestions, setInitialSuggestions,
    switchSession, createSession, deleteSession,
    setMessages: setMessagesWrapper,
  };
}

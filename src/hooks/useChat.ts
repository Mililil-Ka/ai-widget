import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message } from '../types/chat';
import { streamChat } from '../api/chatApi';

const STORAGE_KEY = 'ai-widget-messages';

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => loadMessages());
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isStreamingRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (isStreamingRef.current) return;
    isStreamingRef.current = true;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsStreaming(true);
    setError(null);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() },
    ]);

    try {
      for await (const chunk of streamChat(updatedMessages)) {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.id === assistantId) {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Не удалось получить ответ. Попробуйте позже.');
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
      isStreamingRef.current = false;
    }
  }, [messages]);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsStreaming(false);
    isStreamingRef.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  }, []);

  return { messages, isStreaming, error, sendMessage, reset };
}
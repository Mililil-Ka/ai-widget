import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { FallbackForm } from './FallbackForm';
import type { ChatTheme } from '../types/chat';

interface ChatWidgetProps {
  theme?: ChatTheme;
}

export function ChatWidget({ theme = {} }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isStreaming, error, sendMessage, reset } = useChat();

  const {
    primaryColor = '#3b82f6',
    avatarUrl,
    greeting = 'Здравствуйте! Чем могу помочь?',
    title = 'AI-помощник',
    position = 'bottom-right',
  } = theme;

  const positionClass =
    position === 'bottom-left' ? 'bottom-6 left-6' : 'bottom-6 right-6';

  function handleFallbackSubmit(data: { name: string; phone: string }) {
    console.log('Заявка из fallback:', data);
  }

  return (
    <div className={`fixed ${positionClass} z-50`} translate="no">
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border">
          <div
            className="text-white px-4 py-3 flex justify-between items-center"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-2">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="font-semibold text-sm">{title}</span>
            </div>
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button
                  onClick={reset}
                  className="text-white hover:opacity-75 text-xs"
                  title="Очистить историю"
                >
                  Очистить
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:opacity-75 text-lg leading-none"
                aria-label="Закрыть чат"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            {error ? (
              <FallbackForm onSubmit={handleFallbackSubmit} />
            ) : (
              <MessageList
                messages={messages}
                greeting={greeting}
                primaryColor={primaryColor}
              />
            )}
          </div>

          {!error && (
            <MessageInput
              onSend={sendMessage}
              disabled={isStreaming}
              primaryColor={primaryColor}
            />
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center text-2xl transition-colors"
        style={{ backgroundColor: primaryColor }}
        aria-label="Открыть чат"
      >
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  );
}
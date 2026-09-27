import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { FallbackForm } from './FallbackForm';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isStreaming, error, sendMessage, reset } = useChat();

  function handleFallbackSubmit(data: { name: string; phone: string }) {
    console.log('Заявка из fallback:', data);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border">
          <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-sm">AI-помощник</span>
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button
                  onClick={reset}
                  className="text-white hover:opacity-75 text-xs"
                  aria-label="Очистить историю"
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
              <MessageList messages={messages} />
            )}
          </div>

          {!error && (
            <MessageInput onSend={sendMessage} disabled={isStreaming} />
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 flex items-center justify-center text-2xl"
        aria-label="Открыть чат"
      >
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  );
}
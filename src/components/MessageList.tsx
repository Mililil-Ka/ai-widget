import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm py-8">
        Начните диалог — задайте вопрос
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${message.role === 'user'
            ? 'self-end bg-blue-500 text-white'
            : 'self-start bg-gray-100 text-gray-800'
            }`}
        >
          {message.content}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
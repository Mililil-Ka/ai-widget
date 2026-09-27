import { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  primaryColor?: string;
}

export function MessageInput({
  onSend,
  disabled,
  primaryColor = '#3b82f6',
}: MessageInputProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите сообщение..."
        disabled={disabled}
        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="px-4 py-2 text-white rounded-lg text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        style={{ backgroundColor: primaryColor }}
      >
        Отправить
      </button>
    </form>
  );
}
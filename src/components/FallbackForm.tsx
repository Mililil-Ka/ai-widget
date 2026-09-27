import { useState } from 'react';

interface FallbackFormProps {
  onSubmit: (data: { name: string; phone: string }) => void;
}

export function FallbackForm({ onSubmit }: FallbackFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) return;

    onSubmit({ name: trimmedName, phone: trimmedPhone });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-700 mb-1">Спасибо!</p>
        <p className="text-xs text-gray-500">
          Мы свяжемся с вами в ближайшее время.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
      <p className="text-xs text-gray-500 mb-1">
        AI временно недоступен. Оставьте контакт — мы ответим вручную.
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ваше имя"
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Телефон"
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!name.trim() || !phone.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Отправить
      </button>
    </form>
  );
}
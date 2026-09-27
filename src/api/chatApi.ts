import type { Message } from '../types/chat';

export async function* streamChat(
  messages: Message[]
): AsyncGenerator<string> {
  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No stream');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const data = trimmed.replace('data:', '').trim();
      if (data === '[DONE]') return;

      let json: { content?: string; error?: string };
      try {
        json = JSON.parse(data);
      } catch {
        continue;
      }

      if (json.error) {
        throw new Error(json.error);
      }
      if (json.content) {
        yield json.content;
      }
    }
  }
}
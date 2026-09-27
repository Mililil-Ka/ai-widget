export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
}

export interface ChatTheme {
  primaryColor?: string;
  avatarUrl?: string;
  greeting?: string;
  title?: string;
  position?: 'bottom-right' | 'bottom-left';
}
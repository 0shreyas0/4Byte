export interface Message {
  role: 'user' | 'assistant' | 'image' | 'video';
  content: string;
}

export type MediaRequestType = 'chat' | 'image' | 'video';

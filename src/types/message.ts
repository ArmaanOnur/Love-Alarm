import { User } from './user';

export type MessageType = 'text' | 'voice' | 'gift' | 'emoji' | 'image';

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  type: MessageType;
  metadata?: {
    duration?: number;    // voice message seconds
    giftType?: string;
    imageUrl?: string;
    width?: number;
    height?: number;
  };
  isRead: boolean;
  createdAt: string; // ISO
}

export interface Match {
  id: string;
  user: User;
  matchedAt: string; // ISO
  lastMessage?: Message;
  unreadCount: number;
}

export interface Conversation {
  match: Match;
  messages: Message[];
  hasMore: boolean;
  cursor?: string;
}

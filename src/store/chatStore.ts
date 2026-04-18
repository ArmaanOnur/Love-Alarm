import { create } from 'zustand';
import type { Match, Message, Conversation } from '../types/message';

interface ChatState {
  matches: Match[];
  conversations: Record<string, Conversation>; // keyed by matchId
  typingMatchIds: Set<string>;

  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  removeMatch: (matchId: string) => void;
  setMessages: (matchId: string, messages: Message[], hasMore: boolean, cursor?: string) => void;
  prependMessages: (matchId: string, messages: Message[], cursor?: string) => void;
  addMessage: (matchId: string, message: Message) => void;
  markRead: (matchId: string) => void;
  setTyping: (matchId: string, isTyping: boolean) => void;
  updateLastMessage: (matchId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  matches: [],
  conversations: {},
  typingMatchIds: new Set(),

  setMatches: (matches) => set({ matches }),

  addMatch: (match) =>
    set((state) => ({
      matches: [match, ...state.matches],
    })),

  removeMatch: (matchId) =>
    set((state) => {
      const { [matchId]: _, ...rest } = state.conversations;
      return {
        matches: state.matches.filter((m) => m.id !== matchId),
        conversations: rest,
      };
    }),

  setMessages: (matchId, messages, hasMore, cursor) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [matchId]: {
          match: state.conversations[matchId]?.match ?? state.matches.find((m) => m.id === matchId)!,
          messages,
          hasMore,
          cursor,
        },
      },
    })),

  prependMessages: (matchId, messages, cursor) =>
    set((state) => {
      const existing = state.conversations[matchId];
      if (!existing) return state;
      return {
        conversations: {
          ...state.conversations,
          [matchId]: {
            ...existing,
            messages: [...messages, ...existing.messages],
            cursor,
            hasMore: messages.length > 0,
          },
        },
      };
    }),

  addMessage: (matchId, message) =>
    set((state) => {
      const existing = state.conversations[matchId];
      const match = state.matches.find((m) => m.id === matchId);
      return {
        conversations: {
          ...state.conversations,
          [matchId]: {
            match: existing?.match ?? match!,
            messages: [...(existing?.messages ?? []), message],
            hasMore: existing?.hasMore ?? false,
            cursor: existing?.cursor,
          },
        },
      };
    }),

  markRead: (matchId) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, unreadCount: 0 } : m,
      ),
    })),

  setTyping: (matchId, isTyping) =>
    set((state) => {
      const next = new Set(state.typingMatchIds);
      isTyping ? next.add(matchId) : next.delete(matchId);
      return { typingMatchIds: next };
    }),

  updateLastMessage: (matchId, message) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, lastMessage: message } : m,
      ),
    })),
}));

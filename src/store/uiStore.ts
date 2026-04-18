import { create } from 'zustand';
import type { AppNotification } from '../types/alarm';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'heart';
  duration?: number;
}

interface UIState {
  toasts: Toast[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  isKeyboardVisible: boolean;
  activeTab: string;

  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  addNotification: (n: AppNotification) => void;
  markNotificationsRead: () => void;
  setKeyboardVisible: (v: boolean) => void;
  setActiveTab: (tab: string) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  notifications: [],
  unreadNotificationCount: 0,
  isKeyboardVisible: false,
  activeTab: 'alarm',

  showToast: (toast) => {
    const id = `toast_${++toastCounter}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 3000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications].slice(0, 200),
      unreadNotificationCount: state.unreadNotificationCount + 1,
    })),

  markNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadNotificationCount: 0,
    })),

  setKeyboardVisible: (isKeyboardVisible) => set({ isKeyboardVisible }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));

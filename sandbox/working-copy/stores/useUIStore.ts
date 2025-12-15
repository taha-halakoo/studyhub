import { create } from 'zustand';
import { Notification, CustomTheme, ToastItem } from '../types';

interface UIState {
  toasts: ToastItem[];
  notifications: Notification[];
  language: string;
  customThemes: CustomTheme[];
  debugLogs: string[];

  addToast: (message: string, type: 'info' | 'success' | 'error') => void;
  removeToast: (id: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setLanguage: (lang: string) => void;
  addCustomTheme: (theme: CustomTheme) => void;
  addLog: (msg: string) => void;
}

export const useUIStore = create<UIState>((set: any) => ({
  toasts: [],
  notifications: [],
  language: 'en',
  customThemes: [],
  debugLogs: [],

  addToast: (message: string, type: 'info' | 'success' | 'error') => {
    const id = Date.now().toString();
    set((state: UIState) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state: UIState) => ({ toasts: state.toasts.filter((t: ToastItem) => t.id !== id) }));
    }, 3000);
  },
  
  removeToast: (id: string) => set((state: UIState) => ({ toasts: state.toasts.filter((t: ToastItem) => t.id !== id) })),

  addNotification: (notification: Notification) => set((state: UIState) => ({ notifications: [notification, ...state.notifications] })),
  
  markNotificationRead: (id: string) => set((state: UIState) => ({
    notifications: state.notifications.map((n: Notification) => n.id === id ? { ...n, read: true } : n)
  })),
  
  clearNotifications: () => set((state: UIState) => ({ notifications: [] })),

  setLanguage: (lang: string) => set({ language: lang }),

  addCustomTheme: (theme: CustomTheme) => set((state: UIState) => ({ customThemes: [...state.customThemes, theme] })),

  addLog: (msg: string) => set((state: UIState) => ({ 
    debugLogs: [...state.debugLogs, `${new Date().toLocaleTimeString()} - ${msg}`] 
  }))
}));
import { create } from 'zustand';
import { ChatState, Message, Plan } from '../types';

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentPlan: null,
  isConnected: false,
  isLoading: false,

  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updatePlan: (plan: Plan) =>
    set(() => ({
      currentPlan: plan,
    })),

  setIsConnected: (connected: boolean) =>
    set(() => ({
      isConnected: connected,
    })),

  setIsLoading: (loading: boolean) =>
    set(() => ({
      isLoading: loading,
    })),
}));
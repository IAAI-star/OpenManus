export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Plan {
  id: string;
  title: string;
  steps: Array<{
    text: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
    notes?: string;
  }>;
}

export interface ChatState {
  messages: Message[];
  currentPlan: Plan | null;
  isConnected: boolean;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  updatePlan: (plan: Plan) => void;
  setIsConnected: (connected: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}
import { io, Socket } from 'socket.io-client';
import { Message, Plan } from '../types';

export class WebSocketService {
  private socket: Socket | null = null;
  private messageHandler: ((message: Message) => void) | null = null;
  private planHandler: ((plan: Plan) => void) | null = null;
  private connectionHandler: ((connected: boolean) => void) | null = null;

  constructor() {
    this.socket = io('ws://localhost:8000', {
      path: '/ws',
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.connectionHandler?.(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.connectionHandler?.(false);
    });

    this.socket.on('message', (message: Message) => {
      this.messageHandler?.(message);
    });

    this.socket.on('plan_update', (plan: Plan) => {
      this.planHandler?.(plan);
    });
  }

  public onMessage(handler: (message: Message) => void) {
    this.messageHandler = handler;
  }

  public onPlanUpdate(handler: (plan: Plan) => void) {
    this.planHandler = handler;
  }

  public onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionHandler = handler;
  }

  public sendMessage(message: string) {
    if (this.socket?.connected) {
      this.socket.emit('message', message);
    }
  }

  public disconnect() {
    this.socket?.disconnect();
  }
}

export const wsService = new WebSocketService();
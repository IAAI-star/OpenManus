import { io, Socket } from 'socket.io-client';
import { Message, Plan } from '../types';

export class WebSocketService {
  private socket: Socket | null = null;
  private messageHandler: ((message: Message) => void) | null = null;
  private planHandler: ((plan: Plan) => void) | null = null;
  private connectionHandler: ((connected: boolean) => void) | null = null;

  constructor() {
    this.socket = io('/', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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
      console.log('Received message:', message);
      this.messageHandler?.(message);
    });

    this.socket.on('plan_update', (plan: Plan) => {
      console.log('Received plan update:', plan);
      this.planHandler?.(plan);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connectionHandler?.(false);
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
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }

  public disconnect() {
    this.socket?.disconnect();
  }
}

export const wsService = new WebSocketService();
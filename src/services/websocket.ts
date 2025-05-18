import { Message, Plan } from '../types';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandler: ((message: Message) => void) | null = null;
  private planHandler: ((plan: Plan) => void) | null = null;
  private connectionHandler: ((connected: boolean) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(`ws://${window.location.host}/ws`);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
      this.connectionHandler?.(true);
      this.reconnectAttempts = 0;
    };

    this.socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      this.connectionHandler?.(false);
      this.tryReconnect();
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'plan_update') {
        console.log('Received plan update:', data.data);
        this.planHandler?.(data.data);
      } else {
        console.log('Received message:', data);
        this.messageHandler?.(data);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionHandler?.(false);
    };
  }

  private tryReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
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
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }

  public disconnect() {
    this.socket?.close();
  }
}

export const wsService = new WebSocketService();
// src/utils/websocketService.ts

import store from '../store/store';
import { SystemMetric } from '../types/metrics';
import { fetchSystemMetrics } from '../store/slices/metricsSlice';

interface WebSocketMessage {
    type: string;
    data?: SystemMetric;
}

interface IWebSocketService {
    connect(): Promise<void>;
    disconnect(): void;
    sendMessage(message: WebSocketMessage): void;
    isConnected(): boolean;
    getConnectionState(): string;
    setMessageCallback(callback: (data: WebSocketMessage) => void): void;
}

class WebSocketService implements IWebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private readonly MAX_ATTEMPTS = 5;
    private messageCallback: ((data: WebSocketMessage) => void) | null = null;
    private connectionPromise: Promise<void> | null = null;

    private constructor() {
        console.log("🎭 WebSocket Service Constructor Called");
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public connect(): Promise<void> {
        console.log("🔌 ATTEMPTING WEBSOCKET CONNECTION...");
        
        if (this.connectionPromise) {
            console.log("🔄 Connection already in progress, returning existing promise");
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                if (this.socket?.readyState === WebSocket.OPEN) {
                    console.log("✅ WebSocket already connected!");
                    resolve();
                    return;
                }

                this.socket = new WebSocket('ws://127.0.0.1:8000/ws/metrics/');
                
                this.socket.onopen = () => {
                    console.log('WebSocket connection fucking established! 🎉');
                    this.reconnectAttempts = 0;
                    resolve();
                };
                
                this.socket.onmessage = this.handleMessage.bind(this);
                this.socket.onerror = this.handleError.bind(this);
                this.socket.onclose = this.handleClose.bind(this);
                
            } catch (error) {
                console.error("🔥 WEBSOCKET CREATION FAILED:", error);
                this.connectionPromise = null;
                reject(error);
            }
        });
        
        return this.connectionPromise;
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const data = JSON.parse(event.data) as WebSocketMessage;
            console.log("📨 WebSocket message received:", data);
            
            if (data.type === 'metrics_update' && data.data) {
                // Dispatch to store first
                store.dispatch(fetchSystemMetrics());
                console.log("✅ Store dispatch complete");
                
                // Then call callback if set
                if (this.messageCallback) {
                    console.log("🎭 Executing message callback");
                    this.messageCallback(data);
                }
            }
        } catch (error) {
            console.error("💩 METRIC PARSING FUCKED UP:", error);
        }
    }

    private handleError(error: Event): void {
        console.error("🚨 WEBSOCKET SHIT THE BED:", error);
        this.connectionPromise = null;
    }

    private handleClose(): void {
        console.log("💔 WEBSOCKET FUCKED OFF");
        this.connectionPromise = null;
        this.handleReconnect();
    }

    private handleReconnect(): void {
        if (this.reconnectAttempts < this.MAX_ATTEMPTS) {
            this.reconnectAttempts++;
            console.log(`🔄 ATTEMPTING RECONNECTION #${this.reconnectAttempts}`);
            setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
        } else {
            console.error("💀 MAX RECONNECTION ATTEMPTS REACHED. WE'RE PROPERLY FUCKED.");
        }
    }

    public isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    public getConnectionState(): string {
        if (!this.socket) return "FUCKING DEAD";
        
        switch (this.socket.readyState) {
            case WebSocket.CONNECTING:
                return "ATTEMPTING TO CONNECT...";
            case WebSocket.OPEN:
                return "PROPERLY CONNECTED";
            case WebSocket.CLOSING:
                return "DYING GRACEFULLY";
            case WebSocket.CLOSED:
                return "PROPERLY DEAD";
            default:
                return "QUANTUM STATE OF UNKNOWN FUCKERY";
        }
    }

    public setMessageCallback(callback: (data: WebSocketMessage) => void): void {
        console.log("🎭 Setting message callback");
        this.messageCallback = callback;
        console.log("✅ Callback set:", !!this.messageCallback);
    }

    public sendMessage(message: WebSocketMessage): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('Can\'t send shit, WebSocket isn\'t ready');
        }
    }

    public disconnect(): void {
        console.log("👋 Starting WebSocket disconnect...");
        if (this.socket) {
            this.socket.onclose = null; // Prevent reconnect attempts during intentional disconnect
            this.socket.close();
            this.socket = null;
        }
        this.connectionPromise = null;
        console.log("✅ WebSocket disconnected with dignity");
    }
}

export const websocketService: IWebSocketService = WebSocketService.getInstance();
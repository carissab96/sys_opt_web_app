// src/utils/websocket.ts
import store from '../store/store';
import { SystemMetric } from '../types/metrics';
import { fetchSystemMetrics } from '../store/slices/metricsSlice';

export class MetricsWebSocket {
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private readonly MAX_ATTEMPTS = 5;
    // private messageCallback: ((data: any) => void) | null = null;

    constructor() {
        console.log("🚀 INITIALIZING WEBSOCKET FUCKERY");
        this.setupSocket();
    }

    private setupSocket() {
        try {
            console.log("🔌 ATTEMPTING WEBSOCKET CONNECTION...");
            this.socket = new WebSocket('ws://127.0.01:8000/ws/metrics/');
            
            this.socket.onopen = () => {
                console.log('WebSocket connection fucking established! 🎉');
                this.reconnectAttempts = 0;
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("📊 METRIC PAYLOAD:", data);
                    
                    if (data.type === 'metrics_update' && data.data) {
                        // Using your existing MetricThresholds type
                        store.dispatch(fetchSystemMetrics());
                        console.log("✅ DISPATCH COMPLETE");
                    }
                } catch (error) {
                    console.error("💩 METRIC PARSING FUCKED UP:", error);
                }
            };

            this.socket.onerror = (error) => {
                console.error("🚨 WEBSOCKET SHIT THE BED:", error);
            };

            this.socket.onclose = () => {
                console.log("💔 WEBSOCKET FUCKED OFF");
                this.handleReconnect();
            };

        } catch (error) {
            console.error("🔥 WEBSOCKET CREATION FAILED:", error);
        }
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.MAX_ATTEMPTS) {
            this.reconnectAttempts++;
            console.log(`🔄 ATTEMPTING RECONNECTION #${this.reconnectAttempts}`);
            setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
        } else {
            console.error("💀 MAX RECONNECTION ATTEMPTS REACHED. WE'RE PROPERLY FUCKED.");
        }
    }
    connect(): void {
        throw new Error("Method not implemented.");
    }
    public setMessageCallback(callback: (data: any) => void) {
        this.setMessageCallback = callback;
    }

    public sendMessage(message: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('Can\'t send shit, WebSocket isn\'t ready');
        }
    }

    public disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}
export default MetricsWebSocket;
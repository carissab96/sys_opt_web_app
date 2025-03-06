// src/utils/websocket.ts

export class MetricsWebSocket {
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private readonly MAX_ATTEMPTS = 5;
    private messageCallback: ((data: any) => void) | null = null;

    constructor() {
        this.setupSocket();
    }

    private setupSocket() {
        try {
            this.socket = new WebSocket('ws://localhost:8000/ws/metrics/');
            
            this.socket.onopen = () => {
                console.log('WebSocket connection fucking established! 🎉');
                this.reconnectAttempts = 0;
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (this.messageCallback) {
                    this.messageCallback(data);
                }
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket shit itself:', error);
            };

            this.socket.onclose = () => {
                console.log('WebSocket fucked off');
                this.handleReconnect();
            };

        } catch (error) {
            console.error('Failed to establish WebSocket connection:', error);
        }
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.MAX_ATTEMPTS) {
            this.reconnectAttempts++;
            console.log(`Attempting to unfuck connection, attempt ${this.reconnectAttempts}`);
            setTimeout(() => this.setupSocket(), 1000 * this.reconnectAttempts);
        } else {
            console.error('WebSocket is properly fucked, giving up');
        }
    }

    public setMessageCallback(callback: (data: any) => void) {
        this.messageCallback = callback;
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
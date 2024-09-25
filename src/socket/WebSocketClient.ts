/* eslint-disable @typescript-eslint/no-explicit-any */
// WebSocketClient.ts
class WebSocketClient {
    private socket: WebSocket | null = null;
    private url: string;
    private onMessageCallback: (data: any) => void;

    constructor(url: string, onMessage: (data: any) => void) {
        this.url = url;
        this.onMessageCallback = onMessage;
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);
            this.onMessageCallback(data); // Call the callback with the received data
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    send(message: object) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default WebSocketClient;
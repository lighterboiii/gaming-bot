/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { createContext, useEffect, useState, ReactNode } from 'react';
const { REACT_APP_SOCKET_SERVER_URL } = process.env;

interface WebSocketContextType {
    connect: () => void;
    sendMessage: (message: object) => void;
    disconnect: () => void;
    wsMessages: string[];
    clearMessages: () => void;
}

const SOCKET_SERVER_URL = `${REACT_APP_SOCKET_SERVER_URL}`
const RECONNECT_INTERVAL = 3000;
const PING_INTERVAL = 30000;
const PING_TIMEOUT = 5000;

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [wsMessages, setMessages] = useState<string[]>([]);
    const [messageQueue, setMessageQueue] = useState<object[]>([]);
    const [manualDisconnect, setManualDisconnect] = useState(false);
    const [lastPingTime, setLastPingTime] = useState<number>(0);
    const [pingTimeoutId, setPingTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [pingIntervalId, setPingIntervalId] = useState<NodeJS.Timeout | null>(null);

    const sendPing = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
            setLastPingTime(Date.now());

            const timeoutId = setTimeout(() => {
                console.log('Ping timeout - no pong received');
                if (ws) {
                    ws.close();
                }
            }, PING_TIMEOUT);

            setPingTimeoutId(timeoutId);
        }
    };

    const clearPingTimers = () => {
        if (pingTimeoutId) {
            clearTimeout(pingTimeoutId);
            setPingTimeoutId(null);
        }
        if (pingIntervalId) {
            clearInterval(pingIntervalId);
            setPingIntervalId(null);
        }
    };

    const connect = () => {
        const wsClient = new WebSocket(SOCKET_SERVER_URL);

        wsClient.onopen = () => {
            console.log('WebSocket connected');
            setManualDisconnect(false);
            setTimeout(() => {
                while (messageQueue.length > 0) {
                    sendMessage(messageQueue.shift()!);
                }
            }, 500);

            const intervalId = setInterval(sendPing, PING_INTERVAL);
            setPingIntervalId(intervalId);
        };

        wsClient.onmessage = (event) => {
            const newMessage = event.data;
            const parsedMessage = JSON.parse(newMessage);

            if (parsedMessage.type === 'pong') {
                if (pingTimeoutId) {
                    clearTimeout(pingTimeoutId);
                    setPingTimeoutId(null);
                }
                const pingLatency = Date.now() - lastPingTime;
                console.log(`Pong received, latency: ${pingLatency}ms`);
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        };

        wsClient.onclose = () => {
            console.log('WebSocket disconnected');
            clearPingTimers();
            if (!manualDisconnect) { 
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connect();
                }, RECONNECT_INTERVAL);
            }
        };

        setWs(wsClient);
    };

    useEffect(() => {
        connect();

        return () => {
            clearPingTimers();
            if (ws) {
                ws.close();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendMessage = (message: object) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
            const messageQueueNew = messageQueue.slice();
            messageQueueNew.push(message);
            setMessageQueue(messageQueueNew);
        }
    };
    
    const disconnect = () => {
        if (ws) {
            setManualDisconnect(true);
            clearPingTimers();
            ws.close();
            setWs(null);
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <WebSocketContext.Provider value={{ connect, sendMessage, disconnect, wsMessages, clearMessages }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };
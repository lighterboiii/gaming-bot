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

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [wsMessages, setMessages] = useState<string[]>([]);
    const [messageQueue, setMessageQueue] = useState<object[]>([]);
    // const [isReconnecting, setIsReconnecting] = useState(false);
    const [manualDisconnect, setManualDisconnect] = useState(false);

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
        };

        wsClient.onmessage = (event) => {
            const newMessage = event.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        wsClient.onclose = () => {
            console.log('WebSocket disconnected');
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
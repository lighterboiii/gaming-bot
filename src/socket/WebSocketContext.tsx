/* eslint-disable @typescript-eslint/no-explicit-any */
// WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

import WebSocketClient from './WebSocketClient';

const SOCKET_SERVER_URL = 'wss://gamebottggw2.ngrok.app';

interface WebSocketContextType {
    sendMessage: (message: object) => void;
    messages: string[] | any[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [client, setClient] = useState<WebSocketClient | null>(null);
    const [messages, setMessages] = useState<string[] | any[]>([]);

    useEffect(() => {
        const wsClient = new WebSocketClient(SOCKET_SERVER_URL, (data) => {
            setMessages((prev) => [...prev, JSON.stringify(data)]);
        });
        wsClient.connect();
        setClient(wsClient);

        // Cleanup on component unmount
        return () => {
            wsClient.disconnect();
        };
    }, []);

    const sendMessage = (message: object) => {
        if (client) {
            client.send(message);
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
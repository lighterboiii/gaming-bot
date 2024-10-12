/* eslint-disable @typescript-eslint/no-non-null-assertion */
// WebSocketContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
    connect: () => void;
    sendMessage: (message: object) => void;
    disconnect: () => void;
    wsmessages: string[];
}

const SOCKET_SERVER_URL = 'wss://gamebottggw2.ngrok.app';
const RECONNECT_INTERVAL = 3000; 

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [wsmessages, setMessages] = useState<string[]>([]);
    const [messageQueue, setMessageQueue] = useState<object[]>([]);
    const [isReconnecting, setIsReconnecting] = useState(false);

    const connect = () => {
        const wsClient = new WebSocket(SOCKET_SERVER_URL);

        wsClient.onopen = () => {
            console.log('WebSocket connected');
            setIsReconnecting(false);
            while (messageQueue.length > 0) {
                sendMessage(messageQueue.shift()!);
            }
        };

        wsClient.onmessage = (event) => {
            const newMessage = event.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        wsClient.onclose = () => {
            console.log('WebSocket disconnected');
            if (!isReconnecting) {
                setIsReconnecting(true);
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connect();
                }, RECONNECT_INTERVAL);
            }
        };

        setWs(wsClient);
    };

    useEffect(() => {
        connect(); // Initial connection

        return () => {
            if (ws) {
                ws.close();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     const connect = () => {
    //         const wsClient = new WebSocket(SOCKET_SERVER_URL);

    //         wsClient.onopen = () => {
    //             console.log('WebSocket connected');
    //             setIsReconnecting(false);
    //             while (messageQueue.length > 0) {
    //                 sendMessage(messageQueue.shift()!);
    //             }
    //         };

    //         wsClient.onmessage = (event) => {
    //             const newMessage = event.data;
    //             // console.log(newMessage);
    //             setMessages((prevMessages) => [...prevMessages, newMessage]);
    //         };

    //         wsClient.onclose = () => {
    //             console.log('WebSocket disconnected');
    //             if (!isReconnecting) {
    //                 setIsReconnecting(true);
    //                 setTimeout(() => {
    //                     console.log('Attempting to reconnect...');
    //                     connect();
    //                 }, RECONNECT_INTERVAL);
    //             }
    //         };

    //         setWs(wsClient);
    //     };

    //     connect(); // Initial connection

    //     return () => {
    //         if (ws) {
    //             ws.close();
    //         }
    //     };
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [messageQueue]);

    const sendMessage = (message: object) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Unable to send message.');

            const messageQueueNew = messageQueue.slice();
            messageQueueNew.push(message); // Queue the message
            setMessageQueue(messageQueueNew);
        }
    };
    
    const disconnect = () => {
        if (ws) {
            ws.close();
            setWs(null);
        }
    };
    // const disconnect = () => {
    //     if (ws) {
    //         ws.close();
    //     }
    // }

    return (
        <WebSocketContext.Provider value={{ connect, sendMessage, disconnect, wsmessages }}>
        {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };
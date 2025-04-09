/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { createContext, useEffect, useState, ReactNode } from 'react';
const { REACT_APP_SOCKET_SERVER_URL } = process.env;

interface WebSocketContextType {
    connect: () => void;
    sendMessage: (message: object) => void;
    disconnect: () => void;
    wsMessages: string[];
    clearMessages: () => void;
    setRoomId: (id: string) => void;
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
    const [roomId, setRoomId] = useState<string>('');
    const lastKnownRoomId = React.useRef<string>('');

    useEffect(() => {
        if (roomId) {
            lastKnownRoomId.current = roomId;
        }
    }, [roomId]);

    const sendPing = () => {
        const currentRoomId = roomId || lastKnownRoomId.current;
        if (!currentRoomId) {
            // console.log('No roomId set, skipping ping');
            return;
        }
        
        if (ws && ws.readyState === WebSocket.OPEN) {
            const pingMessage = {
                type: 'ping',
                room_id: currentRoomId
            };
            // console.log('Sending ping:', pingMessage);
            ws.send(JSON.stringify(pingMessage));
            setLastPingTime(Date.now());

            const timeoutId = setTimeout(() => {
                console.log('Ping timeout - no pong received, but keeping connection alive');
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
        if (ws && ws.readyState === WebSocket.OPEN) {
            // console.log('WebSocket already connected, skipping...');
            return;
        }

        // console.log('Creating new WebSocket connection...');
        const wsClient = new WebSocket(SOCKET_SERVER_URL);

        wsClient.onopen = () => {
            // console.log('WebSocket connected');
            setManualDisconnect(false);
            
            if (!roomId && lastKnownRoomId.current) {
                // console.log('Restoring roomId from lastKnownRoomId:', lastKnownRoomId.current);
                setRoomId(lastKnownRoomId.current);
            }

            setTimeout(() => {
                while (messageQueue.length > 0) {
                    sendMessage(messageQueue.shift()!);
                }
            }, 500);

            // console.log('Setting up ping interval...');
            setTimeout(() => {
                // console.log('Sending initial ping...');
                sendPing();
            }, 1000);
            
            const intervalId = setInterval(() => {
                if (wsClient.readyState === WebSocket.OPEN) {
                    // console.log('Ping interval triggered, roomId:', roomId || lastKnownRoomId.current);
                    sendPing();
                } else {
                    // console.log('WebSocket not open, clearing ping interval');
                    clearPingTimers();
                }
            }, PING_INTERVAL);
            setPingIntervalId(intervalId);
            // console.log('Ping interval set up with ID:', intervalId);
        };

        wsClient.onmessage = (event) => {
            const newMessage = event.data;
            const parsedMessage = JSON.parse(newMessage);
            // console.log('Received message:', parsedMessage);

            if (parsedMessage.type === 'pong') {
                // console.log('Received pong:', parsedMessage);
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
            // console.log('WebSocket disconnected');
            clearPingTimers();
            setWs(null);
            if (!manualDisconnect) { 
                // console.log('Will attempt to reconnect in', RECONNECT_INTERVAL, 'ms');
                setTimeout(() => {
                    if (!ws || ws.readyState !== WebSocket.OPEN) {
                        // console.log('Attempting to reconnect...');
                        connect();
                    }
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

    useEffect(() => {
        if (roomId && ws?.readyState === WebSocket.OPEN) {
            // console.log('roomId changed, sending initial ping with roomId:', roomId);
            sendPing();
            
            clearPingTimers();
            const intervalId = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    // console.log('Ping interval triggered, roomId:', roomId);
                    sendPing();
                } else {
                    // console.log('WebSocket not open, clearing ping interval');
                    clearPingTimers();
                }
            }, PING_INTERVAL);
            setPingIntervalId(intervalId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    const sendMessage = (message: object) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            // console.error('WebSocket is not open. Unable to send message.');
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
        <WebSocketContext.Provider value={{ 
            connect, 
            sendMessage, 
            disconnect, 
            wsMessages, 
            clearMessages,
            setRoomId
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketProvider, WebSocketContext };
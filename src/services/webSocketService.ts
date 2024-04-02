import { useEffect, useRef, useState } from 'react';

type MessageHandler<T> = (message: T) => void;

interface IWebSocketService<T> {
  setMessageHandler: (handler: MessageHandler<T>) => void;
  sendMessage: (message: T) => void;
  close: () => void;
}

const useWebSocketService = <T>(url: string): IWebSocketService<T> => {
  const [ws, setWebSocket] = useState<WebSocket | null>(null);
  const messageHandlerRef = useRef<MessageHandler<T> | null>(null);

  const setMessageHandler = (handler: MessageHandler<T>) => {
    messageHandlerRef.current = handler;
  };

  useEffect(() => {
    if (messageHandlerRef.current) {
      const socket = new WebSocket(url);

      socket.onmessage = (event) => {
        try {
          const data: T = JSON.parse(event.data);
          messageHandlerRef.current!(data);
          console.log(data);
        } catch (e) {
          console.error('Ошибка обмена ws сообщением', e);
        }
      };

      socket.onopen = () => {
        console.log('Соединение ws установлено');
      };

      socket.onclose = () => {
        console.log('Соединение ws закрыто');
      };

      socket.onerror = (error) => {
        console.error('Ошибка соединения ws', error);
      };

      setWebSocket(socket);

      return () => {
        socket.close();
      };
    }
  }, [url]);

  const sendMessage = (message: T) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(message);
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket соединение не открыто.');
    }
  };

  const close = () => {
    if (ws) {
      ws.close();
    }
  };

  return {
    setMessageHandler,
    sendMessage,
    close,
  };
};

export default useWebSocketService;
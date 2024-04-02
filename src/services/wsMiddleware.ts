import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { setSocket } from './wsSlice';

export const websocketMiddleware = (wsUrl: string) => {
  let socket: WebSocket | null = null;

  return (store: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    const result = next(action);
    const { dispatch } = store;
    const { type } = action;

    switch (type) {
      case 'WS_CONNECT':
        socket = new WebSocket(wsUrl);
        socket.onopen = () => {
          console.log('WebSocket соединение установлено');
          dispatch(setSocket(socket!));
        };
        socket.onerror = (error) => {
          console.error('Ошибка WebSocket:', error);
        };
        socket.onclose = () => {
          console.log('WebSocket соединение закрыто');
          dispatch(setSocket(null));
        };
        socket.onmessage = (event) => {
          // Обработка входящих сообщений
          console.log('Received message:', event.data);
        };
        break;
      case 'WS_SEND_MESSAGE':
        const { message } = action.payload as { message: string };
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(message);
        } else {
          console.error('WebSocket соединение не открыто или не установлено');
        }
        break;
      default:
        break;
    }

    return result;
  };
};

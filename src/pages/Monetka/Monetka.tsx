/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Loader from '../../components/Loader/Loader';
import { Warning } from '../../components/OrientationWarning/Warning';
import useOrientation from '../../hooks/useOrientation';
import useTelegram from '../../hooks/useTelegram';
import { useAppSelector } from '../../services/reduxHooks';
import { WebSocketContext } from '../../socket/WebSocketContext';
import { indexUrl } from '../../utils/routes';
import { IGameData, ILudkaGameState } from '../../utils/types/gameTypes';
import { getUserId } from '../../utils/userConfig';

import styles from './Monetka.module.scss';

export const Monetka: FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userId = getUserId();
  const isPortrait = useOrientation();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [gameState, setGameState] = useState<ILudkaGameState>({
    data: null,
    winner: null,
    loading: false
  });
  const translation = useAppSelector(store => store.app.languageSettings);
  const { sendMessage, wsMessages, connect, clearMessages, disconnect } = useContext(WebSocketContext)!;
  const parsedMessages = wsMessages?.map(msg => JSON.parse(msg));
  const { tg } = useTelegram();
  console.log(gameState);
  useEffect(() => {
    if (!wsMessages || wsMessages.length === 0) {
      connect();
    }
  }, [connect, wsMessages]);

  useEffect(() => {
    // tg.setHeaderColor('#1b50b8');
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      sendMessage({
        user_id: userId,
        room_id: roomId,
        type: 'kickplayer'
      });
      clearMessages();
      disconnect();
      navigate(indexUrl, { replace: true });
    });

    return () => {
      tg.BackButton.hide();
      // tg.setHeaderColor('#d51845');
    }
  }, [tg, navigate, userId]);

  useEffect(() => {
    setGameState((prev: ILudkaGameState) => ({
      ...prev,
      loading: true
    }));

    if (!roomId) {
      setGameState(prev => ({
        ...prev,
        loading: false
      }));
      return;
    }
    const fetchInitialData = () => {
      sendMessage({
        user_id: userId,
        room_id: roomId,
        type: 'room_info'
      });
    };

    fetchInitialData();

    return () => {
      setGameState(prev => ({
        ...prev,
        loading: false,
        data: null
      }));
    };
  }, []);

  const handleWebSocketMessage = useCallback((message: string) => {
    const res = JSON.parse(message);
    console.log('WebSocket message received:', res);

    switch (res?.type) {
      case 'choice':
        break;
      case 'whoiswin':
        break;
      case 'error':

        if (res?.room_info) {
          setGameState(prev => ({
            ...prev,
            data: res?.room_info,
            winner: null
          }));
        }
        break;
      case 'emoji':
        setGameState(prev => ({
          ...prev,
          data: res,
          winner: null
        }));
        break;
      case 'room_info':
        setGameState(prev => ({
          ...prev,
          loading: false,
          data: res,
        }));
        break;
      case 'add_player':
        setGameState(prev => ({
          ...prev,
          data: res,
          winner: null
        }));
        break;
      case 'kickplayer':
        if (Number(res?.player_id) === Number(userId)) {
          clearMessages();
          disconnect();
          navigate(indexUrl, { replace: true });
        }
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    const messageHandler = (message: any) => {
      handleWebSocketMessage(message);
    };
    const handleMessage = () => {
      if (wsMessages.length > 0) {
        wsMessages.forEach((message: any) => {
          messageHandler(message);
        });
      }
    };
    handleMessage();
  }, [wsMessages]);

  if (!isPortrait) {
    return <Warning />;
  }

  if (gameState.loading) {
    return <Loader />;
  }

  return (
    <div className={styles.monetka}>
      
    </div>
  );
};

export default Monetka; 
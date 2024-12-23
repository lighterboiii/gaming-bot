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
import monetkaButtonsBackground from '../../images/monetka/0.png';
import monetkaBackground from '../../images/monetka/00012-1122478660_3_3 1.png';
import buttonBlueDefault from '../../images/monetka/btn_O_Default.png'
import buttonBlue from '../../images/monetka/btn_O_Default_light.png';
import buttonBlueDisabled from '../../images/monetka/btn_O_Down.png';
import buttonGreenDefault from '../../images/monetka/btn_X_Default.png';
import buttonGreen from '../../images/monetka/btn_X_Default_light.png';
import buttonGreenDisabled from '../../images/monetka/btn_X_Down.png';
import { useAppSelector } from '../../services/reduxHooks';
import { WebSocketContext } from '../../socket/WebSocketContext';
import { indexUrl } from '../../utils/routes';
import { ILudkaGameState } from '../../utils/types/gameTypes';
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
  const [blueButtonState, setBlueButtonState] = useState('default');
  const [greenButtonState, setGreenButtonState] = useState('default');
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  useEffect(() => {
    if (!wsMessages || wsMessages.length === 0) {
      connect();
    }
  }, [connect, wsMessages]);

  useEffect(() => {
    tg.setHeaderColor('#202020');
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
      tg.setHeaderColor('#d51845');
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

  const getButtonImage = (type: 'blue' | 'green', state: string) => {
    if (type === 'blue') {
      switch (state) {
        case 'hover':
          return buttonBlue;
        case 'down':
          return buttonBlueDisabled;
        default:
          return buttonBlueDefault;
      }
    } else {
      switch (state) {
        case 'hover':
          return buttonGreen;
        case 'down':
          return buttonGreenDisabled;
        default:
          return buttonGreenDefault;
      }
    }
  };

  const handleButtonClick = (type: 'blue' | 'green') => {
    const setButtonState = type === 'blue' ? setBlueButtonState : setGreenButtonState;
    
    setButtonState('hover');
    setTimeout(() => {
      setButtonState('down');
      setTimeout(() => {
        setButtonState('default');
      }, 150);
    }, 150);
  };

  useEffect(() => {
    const img = new Image();
    img.src = monetkaBackground;
    img.onload = () => setIsBackgroundLoaded(true);
  }, []);

  if (!isPortrait) {
    return <Warning />;
  }

  if (gameState.loading || !isBackgroundLoaded) {
    return <Loader />;
  }

  return (
    <div className={styles.monetka}>
      <div className={styles.monetka__buttonsContainer}>
        <img src={monetkaButtonsBackground} alt="buttonsBackground" className={styles.monetka__buttons} />
        <div className={styles.monetka__buttonsWrapper}>
          <img 
            src={getButtonImage('blue', blueButtonState)} 
            alt="button" 
            className={styles.monetka__button}
            onClick={() => handleButtonClick('blue')}
          />
          <img 
            src={getButtonImage('green', greenButtonState)} 
            alt="button" 
            className={styles.monetka__button}
            onClick={() => handleButtonClick('green')}
          />
        </div>
      </div>
    </div> 
  );
};

export default Monetka; 
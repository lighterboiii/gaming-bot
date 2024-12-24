/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { formatNumber } from 'utils/additionalFunctions';

import Loader from '../../components/Loader/Loader';
import { Warning } from '../../components/OrientationWarning/Warning';
import useOrientation from '../../hooks/useOrientation';
import useTelegram from '../../hooks/useTelegram';
import monetkaButtonsBackground from '../../images/monetka/0.png';
import buttonBlueDefault from '../../images/monetka/btn_O_Default.png'
import buttonBlue from '../../images/monetka/btn_O_Default_light.png';
import buttonBlueDisabled from '../../images/monetka/btn_O_Down.png';
import buttonGreenDefault from '../../images/monetka/btn_X_Default.png';
import buttonGreen from '../../images/monetka/btn_X_Default_light.png';
import buttonGreenDisabled from '../../images/monetka/btn_X_Down.png';
import greenTiny from '../../images/monetka/green_tiny.png';
import coinDefault from '../../images/monetka/O (1).png';
import coinSilver from '../../images/monetka/O.png';
import redTiny from '../../images/monetka/red_tiny.png';
import vector from '../../images/monetka/Vector.png';
import coinGold from '../../images/monetka/X.png';
import { useAppSelector } from '../../services/reduxHooks';
import { WebSocketContext } from '../../socket/WebSocketContext';
import { indexUrl } from '../../utils/routes';
import { getUserId } from '../../utils/userConfig';

import styles from './Monetka.module.scss';

export const Monetka: FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userId = getUserId();
  const isPortrait = useOrientation();
  const [gameState, setGameState] = useState<any>({
    data: null,
    winner: null,
    loading: false
  });
  const translation = useAppSelector(store => store.app.languageSettings);
  const { sendMessage, wsMessages, connect, clearMessages, disconnect } = useContext(WebSocketContext)!;
  const { tg } = useTelegram();
  const [blueButtonState, setBlueButtonState] = useState('default');
  const [greenButtonState, setGreenButtonState] = useState('default');
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [currentCoin, setCurrentCoin] = useState<string | null>(null);
  const [flashBackground, setFlashBackground] = useState<'coin_bad' | 'coin_good' | null>(null);
  const [coinStates, setCoinStates] = useState<string[]>([
    coinDefault, coinDefault, coinDefault, coinDefault, coinDefault
  ]);
  // Подключение к WebSocket
  useEffect(() => {
    if (!wsMessages || wsMessages.length === 0) {
      connect();
    }
  }, [connect, wsMessages]);

  // Настройка кнопки "Назад" в Telegram и цвета хидера
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

  // Загрузка начального состояния игры
  useEffect(() => {
    setGameState((prev: any) => ({
      ...prev,
      loading: true
    }));

    if (!roomId) {
      setGameState((prev: any) => ({
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
      setGameState((prev: any) => ({
        ...prev,
        loading: false,
        data: null
      }));
    };
  }, []);

  // Обработка всех входящих WebSocket сообщений
  const handleWebSocketMessage = useCallback((message: string) => {
    const res = JSON.parse(message);
    console.log('WebSocket message received:', res);

    switch (res?.type) {
      case 'choice':
        if (res?.game_answer_info) {
          if (res.game_answer_info.animation) {
            setCurrentCoin(res.game_answer_info.animation);
          
            setTimeout(() => {

              setFlashBackground(null);
            
              setTimeout(() => {
                setFlashBackground(res.game_answer_info.message);
                
                setTimeout(() => {
                  setFlashBackground(null);
                  
                  const getCoinStatus = (starValue: string) => {
                    switch(starValue) {
                      case 'o':
                        return coinSilver;
                      case 'x':
                        return coinGold;
                      default:
                        return coinDefault;
                    }
                  };
                  
                  const newStates = Array(5).fill(null).map((_, index) => {
                    const starValue = res.game_answer_info[`mini_star_${index + 1}`];
                    return getCoinStatus(starValue);
                  });
                  
                  setCoinStates(newStates);
                }, 1500);
              }, 50);
            }, 2000);
          }
          console.log(res);
          setGameState((prev: any) => ({
            ...prev,
            data: res,
            winner: null
          }));
        }
        break;
      case 'error':
        if (res?.message === 'not_money') {
          console.log('Недостаточно средств для следующего хода');
        } else if (res?.message === 'error_zero') {
          console.log('Нечего выводить');
        }
        break;
      case 'room_info':
        setGameState((prev: any) => ({
          ...prev,
          loading: false,
          data: res,
        }));
        break;
      case 'add_player':
        setGameState((prev: any) => ({
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

  // Функция-слушатель WebSocket сообщений
  useEffect(() => {
    if (wsMessages.length > 0) {
      const lastMessage = wsMessages[wsMessages.length - 1];
      handleWebSocketMessage(lastMessage);
    }
  }, [wsMessages]);

  // Получение нужной картинки для кнопки
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

  // Обработка нажатия на кнопку
  const handleButtonClick = async (type: 'blue' | 'green') => {
    const setButtonState = type === 'blue' ? setBlueButtonState : setGreenButtonState;
    const choice = type === 'blue' ? "2" : "1";
    
    setButtonState('hover');
    setCurrentCoin(null);

    if (!wsMessages || wsMessages.length === 0) {
      connect();
    }

    setTimeout(() => {
      setButtonState('down');
      
      try {
        sendMessage({
          type: 'choice',
          user_id: userId,
          room_id: roomId,
          choice: choice
        });
      } catch (error) {
        console.error('Ошибка отправки:', error);
      }

      setTimeout(() => {
        setButtonState('default');
      }, 150);
    }, 150);
  };

  // Сбор выигрыша
  const handleCollectWinnings = () => {
    sendMessage({
      type: 'choice',
      user_id: userId,
      room_id: roomId,
      choice: 3
    });
  };

  const getFlashImage = (type: 'coin_bad' | 'coin_good') => {
    return type === 'coin_bad' ? redTiny : greenTiny;
  };

  if (!isPortrait) {
    return <Warning />;
  }

  if (gameState.loading) {
    return <Loader />;
  }

  return (
    <div className={styles.monetka}>
      <div className={`${styles.monetka__layer} ${styles.monetka__layer_empty}`} />
      <div className={`${styles.monetka__layer} ${styles.monetka__layer_fx}`} />
      {flashBackground && (
        <div 
          key={Date.now()}
          className={`${styles.monetka__layer} ${styles.monetka__layer_flash}`} 
          style={{
            backgroundImage: `url(${getFlashImage(flashBackground)})`
          }}
        />
      )}
      <div className={`${styles.monetka__layer} ${styles.monetka__layer_bg}`} />
      <img src={vector} alt="vector" className={styles.monetka__vector} />
      <div className={styles.monetka__defaultCoinContainer}>
        {coinStates.map((coinState, index) => (
          <img 
            key={index}
            src={coinState} 
            alt={`coin ${index}`} 
            className={styles.monetka__defaultCoin} 
          />
        ))}
      </div>
      {currentCoin && (
        <>
          <img 
            src={currentCoin} 
            alt="coin animation" 
            className={styles.monetka__coin}
          />
          {gameState.data?.game_answer_info?.next_x &&
          <div className={styles.monetka__coinValue}>
          + {gameState.data?.game_answer_info?.next_x}
          </div>
          }
        </>
      )}
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
      <div className={styles.monetka__controlButtons}>
        <button 
          className={`${styles.monetka__controlButton} ${styles.monetka__controlButton_pink}`}
          onClick={() => {}}
        >
          Забрать: {gameState.data?.bet || 0}
        </button>
        <button 
          className={`${styles.monetka__controlButton} ${styles.monetka__controlButton_gray}`}
          onClick={() => {}}
          >
          Забрать: {gameState?.data?.win?.winner_value ? formatNumber(Number(gameState?.data?.win?.winner_value)) : 0}
        </button>
      </div>
    </div> 
  );
};

export default Monetka; 
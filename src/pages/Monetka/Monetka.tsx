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
import coinDefault from '../../images/monetka/O (1).png';
import coinSilver from '../../images/monetka/O.png';
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
  const [currentCoin, setCurrentCoin] = useState<string | null>(null);
  const [coinStates, setCoinStates] = useState<string[]>([
    coinDefault, coinDefault, coinDefault, coinDefault, coinDefault
  ]);
  const [flashImage, setFlashImage] = useState<string | null>(null);
  const [nextXValue, setNextXValue] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [blueButtonState, setBlueButtonState] = useState('default');
  const [greenButtonState, setGreenButtonState] = useState('default');
  const [activeButton, setActiveButton] = useState<'bet' | 'collect'>('bet');

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
      setTimeout(() => {
        setGameState((prev: any) => ({
          ...prev,
          loading: false,
          data: null
        }));
      }, 1500);
    };
  }, []);

  // Обработка всех входящих WebSocket сообщений
  const handleWebSocketMessage = useCallback((message: string) => {
    const res = JSON.parse(message);

    const updateBalance = (data: any) => {
      if (data?.players && data.players.length > 0) {
        const currentPlayer = data.players.find((player: any) => 
          Number(player.userid) === Number(userId));
        if (currentPlayer) {
          setBalance(Number(currentPlayer.money));
        }
      }
    };

    switch (res?.type) {
      case 'choice':
        if (res?.game_answer_info) {
          const { animation, message, next_x } = res.game_answer_info;

          // Обновляем состояние монет на основе mini_star_*
          const getCoinStatus = (starValue: string) => {
            switch (starValue) {
              case 'o':
                return coinSilver;
              case 'x':
                return coinGold;
              case 'black':
              default:
                return coinDefault;
            }
          };

          const newStates = Array(5).fill(null).map((_, index) => {
            const starValue = res.game_answer_info[`mini_star_${index + 1}`];
            return getCoinStatus(starValue);
          });

          switch (message) {
            case 'coin_withdrawn':
              setCoinStates(newStates);
              if (next_x) {
                setNextXValue(next_x);
              }
              setActiveButton('bet');
              setGameState((prev: any) => ({
                ...prev,
                data: res,
                winner: null
              }));
              updateBalance(res);
              break;
            case 'coin_good':
            case 'coin_bad':
              if (animation) {
                setCurrentCoin(animation);
                
                setTimeout(() => {
                  const winAnimation = res.game_answer_info.win_animation;
                  if (winAnimation) {
                    setFlashImage(winAnimation);
                    setNextXValue(next_x);
                    setActiveButton('collect');
                    setGameState((prev: any) => ({
                      ...prev,
                      data: res,
                      winner: null
                    }));
                    updateBalance(res);
                  }

                  setTimeout(() => {
                    setFlashImage(null);
                    setCoinStates(newStates);
                  }, 800);
                }, 2000);
              }
              break;
          }

          // setGameState((prev: any) => ({
          //   ...prev,
          //   data: res,
          //   winner: null
          // }));
          // updateBalance(res);
        }
        break;
      case 'error':
        if (res?.message === 'not_money') {
          console.log('Insufficient funds for the next move');
        } else if (res?.message === 'error_zero') {
          console.log('Nothing to withdraw');
        }
        break;
      case 'room_info':
        setGameState((prev: any) => ({
          ...prev,
          loading: false,
          data: res,
        }));
        updateBalance(res);
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
      case 'whoiswin':
        setCoinStates([coinDefault, coinDefault, coinDefault, coinDefault, coinDefault]);
        break;
      default:
        break;
    }
  }, [userId]);

  // Функция-слушатель WebSocket сообщений
  useEffect(() => {
    if (wsMessages.length > 0) {
      const lastMessage = wsMessages[wsMessages.length - 1];
      handleWebSocketMessage(lastMessage);
    }
  }, [wsMessages]);

  // Возвращаем getButtonImage
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

  // Возвращаем старую версию handleButtonClick
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
      {flashImage && (
        <img
          key={flashImage}
          src={flashImage}
          alt="flash"
          className={`${styles.monetka__flash}`}
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
      <>
        {currentCoin && (
          <img
            src={currentCoin}
            alt="coin animation"
            className={styles.monetka__coin}
          />
        )}
        {nextXValue && (
          <div className={styles.monetka__coinValue}>
            <p className={styles.monetka__coinValueText}>+{nextXValue}</p>
          </div>
        )} 
      </>
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
          className={`
            ${styles.monetka__controlButton} 
            ${activeButton === 'collect' 
              ? styles.monetka__controlButton_gray 
              : styles.monetka__controlButton_pink
            }
          `}
          onClick={() => { }}
        >
          Ставка: {gameState.data?.bet || 0}
        </button>
        <button
          className={`
            ${styles.monetka__controlButton} 
            ${activeButton === 'collect'
              ? styles.monetka__controlButton_pink 
              : styles.monetka__controlButton_gray
            }
          `}
          onClick={handleCollectWinnings}
        >
          Забрать: {gameState?.data?.win?.winner_value ? formatNumber(Number(gameState?.data?.win?.winner_value)) : 0}
        </button>
      </div>
      <div className={styles.monetka__balance}>
        <p className={styles.monetka__balanceText}>
          Баланс: {balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Monetka; 
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { setFourthGameRulesState } from 'services/appSlice';
import { useAppDispatch, useAppSelector } from 'services/reduxHooks';
import { MONEY_EMOJI, SHIELD_EMOJI } from 'utils/constants';
import { triggerHapticFeedback } from 'utils/hapticConfig';
import { IAppData } from 'utils/types/appType';

import { setGameRulesWatched } from '../../api/gameApi';
import { getAppData } from '../../api/mainApi';
import Rules from '../../components/Game/Rules/Rules';
import Loader from '../../components/Loader/Loader';
import useTelegram from '../../hooks/useTelegram';
import monetkaButtonsBackground from '../../images/monetka/0.png';
import buttonBlueDefault from '../../images/monetka/btn_O_Default.png'
import buttonBlue from '../../images/monetka/btn_O_Default_light.png';
import buttonBlueDisabled from '../../images/monetka/btn_O_Down.png';
import buttonGreenDefault from '../../images/monetka/btn_X_Default.png';
import buttonGreen from '../../images/monetka/btn_X_Default_light.png';
import buttonGreenDisabled from '../../images/monetka/btn_X_Down.png';
import coinFlipLogo from '../../images/monetka/logo_animated_tiny.png';
import coinDefault from '../../images/monetka/O (1).png';
import coinSilver from '../../images/monetka/O.png';
import vector from '../../images/monetka/Vector.png';
import coinGold from '../../images/monetka/X.png';
import { WebSocketContext } from '../../socket/WebSocketContext';
import { formatNumber } from '../../utils/additionalFunctions';
import { indexUrl } from '../../utils/routes';
import { IMonetkaGameState, ButtonState, CoinAnimationState } from '../../utils/types/gameTypes';
import { getUserId } from '../../utils/userConfig';

import styles from './Monetka.module.scss';

const ANIMATION_DELAYS = {
  BUTTON: 150,
  COIN: {
    DISAPPEAR: 400,
    APPEAR: 700,
    RED_TINT: 250,
    FLASH: 800,
    SEQUENCE: 2000
  },
  ROOM_INFO: 1500
} as const;

export const Monetka: FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const userId = getUserId();
  const dispatch = useAppDispatch();
  const [rules, setRulesShown] = useState<boolean | null>(false);
  const isRulesShown = useAppSelector(store => store.app.fourthGameRulesState);
  const ruleImage = useAppSelector(store => store.app.monetkaRuleImage);
  const [gameState, setGameState] = useState<IMonetkaGameState>({
    data: null,
    winner: null,
    loading: false
  });
  const translation = useAppSelector(store => store.app.languageSettings);
  const { sendMessage, wsMessages, connect, clearMessages, setRoomId } = useContext(WebSocketContext)!;
  const { tg } = useTelegram();
  const [currentCoin, setCurrentCoin] = useState<string | null>(null);
  const [coinStates, setCoinStates] = useState<string[]>([
    coinDefault, coinDefault, coinDefault, coinDefault, coinDefault
  ]);
  const [flashImage, setFlashImage] = useState<string | null>(null);
  const [nextXValue, setNextXValue] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [balance, setBalance] = useState<number>(0);
  const [blueButtonState, setBlueButtonState] = useState<ButtonState>('default');
  const [greenButtonState, setGreenButtonState] = useState<ButtonState>('default');
  const [activeButton, setActiveButton] = useState<'bet' | 'collect'>('bet');
  const [previousCoin, setPreviousCoin] = useState<string | null>(null);
  const [coinAnimationState, setCoinAnimationState] = useState<CoinAnimationState>('default');
  const [commentMessage, setCommentMessage] = useState<string | null>(null);
  const [animateBalance, setAnimateBalance] = useState(false);
  const prevBalanceRef = useRef<number>();

  useEffect(() => {
    if (roomId) {
      setRoomId(roomId);
    }
  }, [roomId, setRoomId]);

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
      setTimeout(() => {
        setGameState((prev: any) => ({
          ...prev,
          loading: false,
          data: null
        }));
      }, 1500);
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

          // Проверяем, все ли звезды заполнены (не black)
          const allStarsFilled = Array(5).fill(null).every((_, index) => {
            const starValue = res.game_answer_info[`mini_star_${index + 1}`];
            return starValue !== 'black';
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
              if (animation) {
                setPreviousCoin(currentCoin);
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

                    setTimeout(() => {
                      setFlashImage(null);
                      setCoinStates(newStates);
                      triggerHapticFeedback('notification', 'success');
                      if (allStarsFilled) {
                        handleCollectWinnings();
                      }
                    }, ANIMATION_DELAYS.COIN.FLASH);
                  }
                }, ANIMATION_DELAYS.COIN.SEQUENCE);
              }
              break;
            case 'coin_bad':
              if (animation) {
                setPreviousCoin(currentCoin);
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

                    setTimeout(() => {
                      setFlashImage(null);

                      setCoinAnimationState('redTint');
                      triggerHapticFeedback('notification', 'error');
                      setTimeout(() => {
                        setCoinAnimationState('disappear');

                        setTimeout(() => {
                          setCoinStates(newStates);
                          setCoinAnimationState('appear');

                          setTimeout(() => {
                            setCoinAnimationState('default');
                          }, ANIMATION_DELAYS.COIN.APPEAR);
                        }, ANIMATION_DELAYS.COIN.DISAPPEAR);
                      }, ANIMATION_DELAYS.COIN.RED_TINT);
                    }, ANIMATION_DELAYS.COIN.FLASH);
                  }
                }, ANIMATION_DELAYS.COIN.SEQUENCE);
              }
              break;
          }
        }
        break;
      case 'error':
        if (res?.error === 'not_money') {
          setCommentMessage(translation?.insufficient_funds || 'Insufficient_funds');
          setTimeout(() => {
            setCommentMessage(null);
            sendMessage({
              user_id: userId,
              room_id: roomId,
              type: 'kickplayer'
            });
          }, 6000);
        }
        break;
      case 'room_info':
        setTimeout(() => {
          setGameState((prev: any) => ({
            ...prev,
            loading: false,
            data: res,
          }));
          if (res?.game_answer_info?.next_x) {
            setNextXValue(res.game_answer_info.next_x);
          }
        }, ANIMATION_DELAYS.ROOM_INFO);
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
          navigate(indexUrl, { replace: true });
        }
        break;
      case 'whoiswin':
        setCoinStates([coinDefault, coinDefault, coinDefault, coinDefault, coinDefault]);
        break;
      case 'comment':
        setCommentMessage(res.text);

        setTimeout(() => {
          setCommentMessage(null);
        }, 4000);
        break;
      default:
        break;
    }
  }, [userId, currentCoin]);

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

  const handleButtonClick = async (type: 'blue' | 'green') => {
    triggerHapticFeedback('impact', 'light');
    const setButtonState = type === 'blue' ? setBlueButtonState : setGreenButtonState;
    const choice = type === 'blue' ? "2" : "1";

    if (blueButtonState === 'down' || greenButtonState === 'down') {
      return;
    }

    setButtonState('hover');

    if (!wsMessages || wsMessages.length === 0) {
      connect();
    }

    const clickSequence = async () => {
      try {
        setButtonState('down');

        await sendMessage({
          type: 'choice',
          user_id: userId,
          room_id: roomId,
          choice: choice
        });

        setTimeout(() => {
          setButtonState('default');
        }, ANIMATION_DELAYS.BUTTON);
      } catch (error) {
        console.error('Error in button click:', error);
        setButtonState('default');
      }
    };

    setTimeout(() => {
      clickSequence();
    }, ANIMATION_DELAYS.BUTTON);
  };

  // Сбор выигрыша
  const handleCollectWinnings = () => {
    setCoinAnimationState('disappear');
    triggerHapticFeedback('impact', 'heavy');
    setTimeout(() => {
      setCoinStates([coinDefault, coinDefault, coinDefault, coinDefault, coinDefault]);
      setCoinAnimationState('appear');

      setTimeout(() => {
        setCoinAnimationState('default');
      }, ANIMATION_DELAYS.COIN.APPEAR);
    }, ANIMATION_DELAYS.COIN.DISAPPEAR);

    sendMessage({
      type: 'choice',
      user_id: userId,
      room_id: roomId,
      choice: 3
    });
  };
// получить баланс пользователя
  const getCurrentPlayerBalance = useCallback(() => {
    if (!gameState.data?.players) return 0;

    const currentPlayer = gameState.data.players.find((player: any) => Number(player.userid) === Number(userId));

    if (!currentPlayer) return 0;

    return gameState.data?.bet_type === "3"
      ? Number(currentPlayer.tokens)
      : Number(currentPlayer.money);
  }, [gameState.data?.players, gameState.data?.bet_type, userId]);
  // Проверка правил при старте игры
  useEffect(() => {
    setRulesShown(isRulesShown);
  }, [isRulesShown]);
  // обработчик клика по кнопке "Ознакомился"
  const handleRuleButtonClick = () => {
    setGameRulesWatched(userId, '4');
    triggerHapticFeedback('impact', 'soft');
    setRulesShown(true);
    setTimeout(() => {
      getAppData(userId)
        .then((response: IAppData) => {
          dispatch(setFourthGameRulesState(response.game_rule_4_show));
        })
        .catch((error: Error) => {
          console.error('Get user data error:', error);
        })
    }, 1000);
  };

  useEffect(() => {
    const currentBalance = getCurrentPlayerBalance();
    
    if (prevBalanceRef.current !== undefined && currentBalance !== prevBalanceRef.current) {
      setAnimateBalance(true);
      setTimeout(() => setAnimateBalance(false), 500);
    }
    
    prevBalanceRef.current = currentBalance;
  }, [getCurrentPlayerBalance]);

// показ лоадера
  if (gameState.loading) {
    return <Loader />;
  }

  return (
    <div className={styles.monetka}>
      {rules ? (
        <>
          <img src={coinFlipLogo} alt="coin flip logo" className={styles.monetka__logo} />
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
                className={`${styles.monetka__defaultCoin}
                 ${coinAnimationState !== 'default' && coinState === coinDefault
                    ? styles[`monetka__defaultCoin_${coinAnimationState}`]
                    : ''
                  }`}
                style={{
                  animationDelay: coinAnimationState === 'appear'
                    ? `${index * 0.15}s`
                    : '0s'
                }}
              />
            ))}
          </div>
          <>
            {(currentCoin || previousCoin) && (
              <div className={styles.monetka__coinContainer}>
                {previousCoin && (
                  <img
                    key={`prev-${previousCoin}`}
                    src={previousCoin}
                    alt="previous coin animation"
                    className={`${styles.monetka__coin} ${styles.monetka__coin_fadeOut}`}
                  />
                )}
                {currentCoin && (
                  <img
                    key={`current-${currentCoin}`}
                    src={currentCoin}
                    alt="current coin animation"
                    className={`${styles.monetka__coin} ${styles.monetka__coin_fadeIn}`}
                  />
                )}
              </div>
            )}
            {nextXValue && (
              <div className={styles.monetka__coinValue}>
                <p className={styles.monetka__coinValueText}>+{gameState.data?.bet_type === "1"
                  ? MONEY_EMOJI
                  : SHIELD_EMOJI
                }
                  {nextXValue}
                </p>
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
              <span className={styles.monetka__controlButton__label}>
                {translation.game_bet_text}:
              </span>
              <span className={styles.monetka__controlButton__content}>
                <span className={styles.monetka__controlButton__emoji}>
                  {gameState.data?.bet_type === "1"
                    ? MONEY_EMOJI
                    : SHIELD_EMOJI
                  }
                </span>
                <span className={styles.monetka__controlButton__value}>
                  {gameState.data?.bet || 0}
                </span>
              </span>
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
              <span className={styles.monetka__controlButton__label}>
                {translation.claim}:
              </span>
              <span className={styles.monetka__controlButton__content}>
                <span className={styles.monetka__controlButton__emoji}>
                  {gameState?.data?.bet_type === "1"
                    ? MONEY_EMOJI
                    : SHIELD_EMOJI
                  }
                </span>
                <span className={styles.monetka__controlButton__value}>
                  {gameState?.data?.win?.winner_value ? formatNumber(Number(gameState?.data?.win?.winner_value)) : 0}
                </span>
              </span>
            </button>
          </div>
          <div className={styles.monetka__balance}>
            <p className={`${styles.monetka__balanceText} ${animateBalance ? styles.animate : ''}`}>
              {translation.webapp_balance}: {getCurrentPlayerBalance().toFixed(2)}
            </p>
          </div>
          {commentMessage && (
            <div className={styles.monetka__commentContainer}>
              <p className={styles.monetka__commentText}>{commentMessage}</p>
            </div>
          )}
        </>
      ) : (
        <Rules
          handleRuleButtonClick={handleRuleButtonClick}
          ruleImage={ruleImage!}
        />
      )}
    </div>
  );
};

export default Monetka; 
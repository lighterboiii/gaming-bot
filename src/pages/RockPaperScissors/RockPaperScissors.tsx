/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback, useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { setFirstGameRulesState } from "services/appSlice";
import { useAppDispatch, useAppSelector } from "services/reduxHooks";
import { WebSocketContext } from "socket/WebSocketContext";
import { MONEY_EMOJI, SHIELD_EMOJI } from "utils/constants";
import { triggerHapticFeedback } from "utils/hapticConfig";
import { indexUrl } from "utils/routes";
import { IGameData, IPlayer } from "utils/types/gameTypes";
import { getUserId } from "utils/userConfig";

import { setGameRulesWatched } from "../../api/gameApi";
import { getAppData } from "../../api/mainApi";
import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";
import ChoiceBox from "../../components/Game/ChoiceBox/ChoiceBox";
import HandShake from '../../components/Game/HandShake/HandShake';
import Players from "../../components/Game/RPSPlayers/Players";
import Rules from "../../components/Game/Rules/Rules";
import Loader from "../../components/Loader/Loader";
import useTelegram from "../../hooks/useTelegram";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import lLoseAnim from '../../images/rock-paper-scissors/winlose/l_lose.png';
import lWinAnim from '../../images/rock-paper-scissors/winlose/l_win.png';
import rLoseAnim from '../../images/rock-paper-scissors/winlose/r_lose.png';
import rWinAnim from '../../images/rock-paper-scissors/winlose/r_win.png';

import styles from "./RockPaperScissors.module.scss";

export const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg } = useTelegram();
  const location = useLocation();
  const userId = getUserId();
  const { roomId } = useParams<{ roomId: string | any }>();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<IGameData | null>(null);
  const [choice, setChoice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [animation, setAnimation] = useState<any>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [playersAnim, setPlayersAnim] = useState({ firstAnim: null, secondAnim: null });
  const [rules, setRulesShown] = useState<boolean | null>(false);
  const [isChoiceLocked, setIsChoiceLocked] = useState<boolean>(false);
  const translation = useAppSelector(store => store.app.languageSettings);
  const isRulesShown = useAppSelector(store => store.app.firstGameRulesState);
  const ruleImage = useAppSelector(store => store.app.RPSRuleImage);
  const activeHands = useAppSelector(store => store.app.info?.active_hands);
  const { sendMessage, wsMessages, clearMessages } = useContext(WebSocketContext)!;
  const [timer, setTimer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isTimerShown, setIsTimerShown] = useState<boolean>(false);

  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
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
  // запрос результата хода
  const updateAnimation = useCallback((newAnimation: string) => {
    setAnimation((prevAnimation: string) => {
      if (prevAnimation !== newAnimation) {
        setAnimationKey((prevKey) => prevKey + 1);
        return newAnimation;
      }
      return prevAnimation;
    });
  }, []);

  useEffect(() => {
    setLoading(true);

    if (!roomId) {
      setLoading(false);
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
      setLoading(false);
      setData(null);
    };
  }, []);

  const handleTimer = useCallback((initialTime: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimer(initialTime);
    setIsTimerShown(true);

    const newInterval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === null || prevTime <= 1) {
          clearInterval(newInterval);
          timerRef.current = null;
          setIsTimerShown(false);
          return null;
        }
        return prevTime - 1;
      });
    }, 1000);

    timerRef.current = newInterval;
  }, []);

  useEffect(() => {
    const handleTimerMessages = (message: any) => {
      const res = JSON.parse(message);
      if (res?.type === 'timer_started') {
        handleTimer(res.timer_time);
      } else if (res?.type === 'timer_stopped') {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimer(null);
        setIsTimerShown(false);
      }
    };

    const handleMessage = () => {
      const lastMessage = wsMessages[wsMessages.length - 1];
      if (lastMessage) {
        handleTimerMessages(lastMessage);
      }
    };
    handleMessage();
  }, [wsMessages, handleTimer]);

  useEffect(() => {
    const handleRegularMessage = (res: any) => {
      switch (res.type) {
        case 'room_info':
          setData(prevData => ({
            ...prevData,
            ...res,
          }));
          setLoading(false);
          break;
        case 'choice':
        case 'emoji':
          setData(prevData => {
            if (!prevData) return res;
            return {
              ...prevData,
              players: prevData.players.map(player => {
                const updatedPlayer = res.players.find((p: IPlayer) => p.userid === player.userid);
                return updatedPlayer ? { ...player, ...updatedPlayer } : player;
              })
            };
          });
          break;
        case 'kickplayer':
          if (Number(res?.player_id) === Number(userId)) {
            navigate(indexUrl, { replace: true });
            clearMessages();
          }
          break;
      }
    };

    const handleWinMessage = (res: any) => {
      setPlayersAnim({
        firstAnim: res?.whoiswin.f_anim,
        secondAnim: res?.whoiswin.s_anim,
      });

      const animationTime = 3000;
      setAnimationKey(prevKey => prevKey + 1);

      const gameResult = (() => {
        if (Number(res?.whoiswin.winner) === Number(userId)) {
          triggerHapticFeedback('notification', 'success');
          return {
            animation: Number(data?.creator_id) === Number(res?.whoiswin.winner)
              ? lWinAnim
              : rWinAnim,
            message: `${translation?.you_won} ${res?.whoiswin.winner_value !== 'none'
              ? `${res?.whoiswin.winner_value} ${data?.bet_type === "1" 
              ? `${MONEY_EMOJI}` 
              : `${SHIELD_EMOJI}`}`
              : ''}`
          };
        }
        if (Number(res?.whoiswin.winner) !== Number(userId) && res?.whoiswin.winner !== 'draw') {
          triggerHapticFeedback('notification', 'error');
          return {
            animation: Number(data?.creator_id) === Number(res?.whoiswin.winner)
              ? lLoseAnim
              : rLoseAnim,
            message: `${translation?.you_lost} ${data?.bet} ${data?.bet_type === "1" 
              ? `${MONEY_EMOJI}` 
              : `${SHIELD_EMOJI}`}`
          };
        }
        if (res?.whoiswin.winner === 'draw') {
          triggerHapticFeedback('impact', 'heavy');
          return {
            animation: null,
            message: translation?.draw
          };
        }
        return null;
      })();

      setTimeout(() => {
        if (gameResult) {
          if (gameResult.animation) {
            updateAnimation(gameResult.animation);
          }
          setMessage(gameResult.message);
          setMessageVisible(true);
        }

        setTimeout(() => {
          setMessageVisible(false);
          setAnimation(null);
          setPlayersAnim({
            firstAnim: null,
            secondAnim: null,
          });
          clearMessages();
        }, 3500);
      }, animationTime);
    };

    const messageHandler = (message: any) => {
      const res = JSON.parse(message);
      switch (res?.type) {
        case 'room_info':
        case 'choice':
        case 'emoji':
        case 'kickplayer':
          handleRegularMessage(res);
          break;
        case 'whoiswin':
          if (message === wsMessages[wsMessages.length - 1]) {
            handleWinMessage(res);
          }
          break;
        default:
          break;
      }
    };

    wsMessages.forEach(messageHandler);
  }, [wsMessages]);

  // проверка правил при старте игры
  useEffect(() => {
    setRulesShown(isRulesShown);
  }, [dispatch, isRulesShown]);
  // хенлер готовности игрока websocket
  const handleReady = () => {
    const player = data?.players.find((player: any) => Number(player?.userid) === Number(userId));

    if (data?.bet_type === "1") {
      if (player?.money && (player?.money <= Number(data?.bet))) {
        sendMessage({
          user_id: player?.userid,
          room_id: roomId,
          type: 'kickplayer'
        });

        if (player?.userid === userId) {
          const currentUrl = location.pathname;
          currentUrl !== indexUrl && navigate(indexUrl);
        }
        triggerHapticFeedback('notification', 'error');
        return;
      }
    } else if (data?.bet_type === "3") {
      if (player?.tokens && (player?.tokens <= Number(data?.bet))) {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });

        triggerHapticFeedback('notification', 'error');
        return;
      }
    }

    setMessageVisible(false);
    setIsChoiceLocked(false);
    setMessage('');

    sendMessage({
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: 'ready'
    });

    triggerHapticFeedback('impact', 'soft');
  };
  // хендлер выбора хода Websocket
  const handleChoice = (value: string) => {
    if (isChoiceLocked) return;
    setIsChoiceLocked(true);
    const choice = {
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: value
    };

    sendMessage(choice);
    triggerHapticFeedback('impact', 'soft');
  };
  // хендлер отпрвки эмодзи websocket
  const handleEmojiSelect = (emoji: string) => {
    const data = {
      user_id: userId,
      room_id: roomId,
      type: 'emoji',
      emoji: emoji
    };
    sendMessage(data);
    triggerHapticFeedback('impact', 'soft');
    setShowEmojiOverlay(false);
  };
  // обработчик клика по кнопке "Ознакомился" - е Websocket
  const handleRuleButtonClick = () => {
    setGameRulesWatched(userId, '1');
    triggerHapticFeedback('impact', 'soft');
    setRulesShown(true);
    setTimeout(() => {
      getAppData(userId)
        .then((res) => {
          dispatch(setFirstGameRulesState(res.game_rule_1_show));
        })
        .catch((error) => {
          console.error('Get user data error:', error);
        })
    }, 1000);
  };

  const handleShowEmojiOverlay = () => {
    triggerHapticFeedback('impact', 'light');
    setShowEmojiOverlay(true);
  };

  const handleCloseEmojiOverlay = () => {
    triggerHapticFeedback('impact', 'soft');
    setShowEmojiOverlay(!showEmojiOverlay)
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.game}>
      <div
        className={styles.game__result}
        style={{ backgroundImage: `url(${animation}?key=${animationKey})` }}
      >
        {loading ? <Loader /> : (
          <>
            {rules ? (
              <>
                <Players data={data as IGameData} />
                <>
                  {data?.players_count === "2" &&
                    data?.players?.every((player: IPlayer) => player?.choice === 'ready') &&
                    <img src={newVS}
                      alt="versus icon"
                      className={styles.game__versusImage} />}
                  {messageVisible ? (
                    <p className={styles.game__resultMessage}>
                      {message}
                    </p>
                  ) : (
                    <p className={styles.game__timer}>
                      {isTimerShown && timer !== null && timer}
                    </p>
                  )}
                  <div className={styles.game__hands}>
                    {(
                      data?.players_count === "2"
                    ) ? (
                      <HandShake
                        player1={playersAnim.firstAnim || data?.players[0]?.hands || ''}
                        player2={playersAnim.secondAnim || data?.players[1]?.hands || ''} />
                    ) : (
                      data?.players_count === "1"
                    ) ? (
                      <p className={styles.game__notify}>{translation?.waiting4players}</p>
                    ) :
                      ''}
                  </div>
                  <div className={styles.game__lowerContainer}>
                    <div className={styles.game__betContainer}>
                      <p className={styles.game__text}>{translation?.game_bet_text}</p>
                      <div className={styles.game__bet}>
                        <p className={styles.game__text}>
                          {data?.bet_type === "1"
                            ? `${MONEY_EMOJI}`
                            : `${SHIELD_EMOJI}`
                          }
                        </p>
                        <p className={styles.game__text}>{data?.bet}</p>
                      </div>
                    </div>
                    {(data?.players?.every((player: IPlayer) => player?.choice !== 'none')
                      && data?.players_count === "2") ? (
                      <div className={styles.game__buttonsWrapper}>
                        <ChoiceBox
                          choice={choice}
                          isChoiceLocked={isChoiceLocked}
                          handleChoice={handleChoice}
                        />
                      </div>
                    ) : (
                      <div className={styles.game__readyWrapper}>
                        <input
                          type="checkbox"
                          id="ready"
                          onChange={handleReady}
                          className={styles.game__checkbox} />
                        <label htmlFor="ready"
                          className={styles.game__label} />
                      </div>
                    )}
                    <button
                      type="button"
                      className={`${styles.game__button} ${styles.game__emojiButton}`}
                      onClick={handleShowEmojiOverlay}
                    >
                      <img src={emoji_icon}
                        alt="emoji icon"
                        className={styles.game__iconEmoji} />
                    </button>
                  </div>
                </>
              </>
            ) : (
              <Rules
                handleRuleButtonClick={handleRuleButtonClick}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ruleImage={ruleImage!}
              />
            )
            }
          </>
        )}
        <EmojiOverlay
          show={showEmojiOverlay}
          onClose={handleCloseEmojiOverlay}
          onEmojiSelect={handleEmojiSelect}
          userId={userId}
          backgroundColor="#0D2759"
        />
      </div>
    </div>
  );
};
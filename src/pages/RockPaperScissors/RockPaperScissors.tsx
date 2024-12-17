/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useCallback, useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { setFirstGameRulesState } from "services/appSlice";
import { useAppDispatch, useAppSelector } from "services/reduxHooks";
import { WebSocketContext } from "socket/WebSocketContext";
import { MONEY_EMOJI, SHIELD_EMOJI } from "utils/constants";
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
import { Warning } from "../../components/OrientationWarning/Warning";
import { useImagePreload } from '../../contexts/ImagePreloadContext';
import useOrientation from "../../hooks/useOrientation";
import useTelegram from "../../hooks/useTelegram";

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
  const isPortrait = useOrientation();
  const { sendMessage, wsMessages, clearMessages, disconnect } = useContext(WebSocketContext)!;
  const [timer, setTimer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isTimerShown, setIsTimerShown] = useState<boolean>(false);
  const { isLoading: imagesLoading, preloadedImages } = useImagePreload();

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
      disconnect();
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

    const lastMessage = wsMessages[wsMessages.length - 1];
    if (lastMessage) {
      handleTimerMessages(lastMessage);
    }
  }, [wsMessages, handleTimer]);

  useEffect(() => {
    const messageHandler = (message: any) => {
      const res = JSON.parse(message);
      switch (res?.type) {
        case 'room_info':
          setData(res);
          setLoading(false);
          break;
        case 'whoiswin':
          setPlayersAnim({
            firstAnim: res?.whoiswin.f_anim,
            secondAnim: res?.whoiswin.s_anim,
          });
          
          const animationTime = 3000;
          setAnimationKey(prevKey => prevKey + 1);
          
          setTimeout(() => {
            if (Number(res?.whoiswin.winner) === Number(userId)) {
              updateAnimation(Number(data?.creator_id) === Number(res?.whoiswin.winner) 
                ? preloadedImages.lWinAnim 
                : preloadedImages.rWinAnim);
              // postEvent(
              //   'web_app_trigger_haptic_feedback',
              //   { type: 'notification', notification_type: 'success' }
              // );
              setMessage(`${translation?.you_won} ${res?.whoiswin.winner_value !== 'none'
                ? `${res?.whoiswin.winner_value} ${data?.bet_type === "1" ? `💵`
                  : `🔰`}`
                : ''}`);
            } else if (Number(res?.whoiswin.winner_value) !== Number(userId) && res?.whoiswin.winner !== 'draw') {
              updateAnimation(Number(data?.creator_id) === Number(res?.whoiswin.winner) 
                ? preloadedImages.lLoseAnim 
                : preloadedImages.rLoseAnim);
              // postEvent(
              //   'web_app_trigger_haptic_feedback',
              //   { type: 'notification', notification_type: 'error', }
              // );
              setMessage(`${translation?.you_lost} ${data?.bet} ${data?.bet_type === "1"
                ? `💵`
                : `🔰`}`);
            } else if (res?.whoiswin.winner === 'draw') {
              setMessage(translation?.draw);
              // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
            }
            setMessageVisible(true);

            setTimeout(() => {
              setMessageVisible(false);
              setAnimation(null);
              setPlayersAnim({
                firstAnim: null,
                secondAnim: null,
              });
              clearMessages();
            }, 3500)

          }, animationTime);
          break;
        case 'choice':
          setData(res);
          break;
        case 'emoji':
          setData(res);
          break;
        case 'kickplayer':
          if (Number(res?.kicked_id) === Number(userId)) {
            setLoading(false);
            clearMessages();
            disconnect();
            setTimeout(() => {
              navigate(indexUrl, { replace: true });
            }, 100);
          }
          break;
        default:
          break;
      }
    };

    const handleMessage = () => {
      const lastMessage = wsMessages[wsMessages.length - 1];
      if (lastMessage) {
        messageHandler(lastMessage);
      }
    };
    handleMessage();
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
        // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
        return;
      }
    } else if (data?.bet_type === "3") {
      if (player?.tokens && (player?.tokens <= Number(data?.bet))) {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });

        // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
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

    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
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
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
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
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
    setShowEmojiOverlay(false);

    setTimeout(() => {
      const noneData = {
        user_id: userId,
        room_id: roomId,
        type: 'emoji',
        emoji: 'none'
      };
      sendMessage(noneData);
    }, 3000);
  };
  // обработчик клика по кнопке "Ознакомился" - не Websocket
  const handleRuleButtonClick = () => {
    setGameRulesWatched(userId, '1');
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
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
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
    setShowEmojiOverlay(true);
  };

  const handleCloseEmojiOverlay = () => {
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
    setShowEmojiOverlay(!showEmojiOverlay)
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!isPortrait) {
    return (
      <Warning />
    );
  }

  if (loading || imagesLoading) {
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
                    <img src={preloadedImages.newVS}
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
                        player1={playersAnim.firstAnim || preloadedImages.leftRock}
                        player2={playersAnim.secondAnim || preloadedImages.rightRock} />
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
                        <p className={styles.game__text}>{data?.bet_type === "1"
                          ? `${MONEY_EMOJI}`
                          : `${SHIELD_EMOJI}`}
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
                      <img src={preloadedImages.emoji_icon}
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
        />
      </div>
    </div>
  );
};
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { setGameRulesWatched } from "../../api/gameApi";
import { getAppData } from "../../api/mainApi";
import { userId } from "../../api/requestData";
import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";
import ChoiceBox from "../../components/Game/ChoiceBox/ChoiceBox";
import HandShake from '../../components/Game/HandShake/HandShake';
import Players from "../../components/Game/RPSPlayers/Players";
import Rules from "../../components/Game/Rules/Rules";
import Loader from "../../components/Loader/Loader";
import { Warning } from "../../components/OrientationWarning/Warning";
import useOrientation from "../../hooks/useOrientation";
import useSetTelegramInterface from "../../hooks/useSetTelegramInterface";
import useTelegram from "../../hooks/useTelegram";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import leftRock from '../../images/rock-paper-scissors/left_rock.png';
import rightRock from '../../images/rock-paper-scissors/right_rock.png';
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import lLoseAnim from '../../images/rock-paper-scissors/winlose/l_lose.png';
import lWinAnim from '../../images/rock-paper-scissors/winlose/l_win.png';
import rLoseAnim from '../../images/rock-paper-scissors/winlose/r_lose.png';
import rWinAnim from '../../images/rock-paper-scissors/winlose/r_win.png';
import { setFirstGameRulesState } from "../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { useWebSocket } from "../../socket/WebSocketContext";
import { roomsUrl } from "../../utils/routes";
import { IGameData, IPlayer } from "../../utils/types/gameTypes";

import styles from "./RockPaperScissors.module.scss";

export const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const location = useLocation();
  // const userId = user?.id;
  const { roomId } = useParams<{ roomId: string }>();
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
  const [timer, setTimer] = useState<number>(15);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showTimer, setShowTimer] = useState(true);
  const [rules, setRulesShown] = useState<boolean | null>(false);
  const [anyPlayerReady, setAnyPlayerReady] = useState<boolean>(false);
  const [isChoiceLocked, setIsChoiceLocked] = useState<boolean>(false);
  const translation = useAppSelector(store => store.app.languageSettings);
  const isRulesShown = useAppSelector(store => store.app.firstGameRulesState);
  const ruleImage = useAppSelector(store => store.app.RPSRuleImage);
  const isPortrait = useOrientation();
  const { sendMessage, messages } = useWebSocket();

  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    setLoading(true);

    if (!roomId) {
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

    const messageHandler = (message: any) => {
      const res = JSON.parse(message);
      console.log(res);
      if (res?.message === 'None') {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });
        const currentUrl = location.pathname;
        currentUrl !== roomsUrl && navigate(roomsUrl);
      } else if (res?.message === 'timeout') {
        fetchInitialData();
      } else {
        setData(res);
        setLoading(false);
      }
    };
    const handleMessage = () => {
      messages.forEach((message: any) => {
        messageHandler(message);
      });
    };

    handleMessage();

    return () => {
      // sendMessage({
      //   user_id: userId,
      //   room_id: roomId,
      //   type: 'kickplayer'
      // });
    };
  }, [roomId, userId, messages, sendMessage, navigate]);
  // проверка правил при старте игры
  useEffect(() => {
    setRulesShown(isRulesShown);
  }, [isRulesShown]);
  // не помню, нахер надо
  useEffect(() => {
    if (data?.players?.some((player: IPlayer) => player.choice === 'ready')) {
      setAnyPlayerReady(true);
    } else {
      setAnyPlayerReady(false);
    }
  }, [data]);

  useSetTelegramInterface(roomsUrl, userId);
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
    let timeoutId: any;
    const fetchData = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (data?.players?.every((player: IPlayer) => player?.choice !== 'none' && player?.choice !== 'ready')) {
          console.log('data', data);
          setShowTimer(false);
          if (roomId) {
            sendMessage({
              user_id: userId,
              room_id: roomId,
              type: 'whoiswin'
            });
            setPlayersAnim({
              firstAnim: data?.win.f_anim,
              secondAnim: data?.win.s_anim,
            });
            const animationTime = 3000;
            setAnimationKey(prevKey => prevKey + 1);
            if (data?.win.users !== "none" && data?.win.winner_id !== "none" && data?.win.winner_value !== "none") {
              setTimeout(() => {
                if (data?.win.winner_id === userId) {
                  updateAnimation(Number(data.creator_id) === Number(data?.win.winner_id) ? lWinAnim : rWinAnim);
                  postEvent(
                    'web_app_trigger_haptic_feedback',
                    { type: 'notification', notification_type: 'success' }
                  );
                  setMessage(`${translation?.you_won} ${data?.win.winner_value !== 'none'
                    ? `${data?.win.winner_value} ${data?.bet_type === "1" ? `💵`
                      : `🔰`}`
                    : ''}`);
                } else if (Number(data?.win.winner_value) !== Number(userId) && data?.win.winner_id !== 'draw') {
                  updateAnimation(Number(data.creator_id) === Number(data.win.winner_id) ? lLoseAnim : rLoseAnim);
                  postEvent(
                    'web_app_trigger_haptic_feedback',
                    { type: 'notification', notification_type: 'error', }
                  );
                  setMessage(`${translation?.you_lost} ${data?.bet} ${data?.bet_type === "1"
                    ? `💵`
                    : `🔰`}`);
                } else if (data?.win.winner_id === 'draw') {
                  setMessage(translation?.draw);
                  postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
                }
                setMessageVisible(true);
                setTimeout(() => {
                  setMessageVisible(false);
                  setAnimation(null);
                  setAnyPlayerReady(true);
                  setTimer(15);
                  setPlayersAnim({
                    firstAnim: null,
                    secondAnim: null,
                  });
                }, 4000)
              }, animationTime);
            }
          }
        }
      }, 1500);
    };

    fetchData();
  }, [data, roomId, translation?.draw, translation?.you_lost, translation?.you_won, updateAnimation, userId]);
  // хендлер готовности игрока websocket
  const handleReady = () => {
    const player = data?.players.find((player: any) => Number(player?.userid) === Number(userId));

    if (data?.bet_type === "1") {
      if (player?.money && (player?.money <= Number(data?.bet))) {
        sendMessage({
          user_id: player?.userid,
          room_id: roomId,
          type: 'kickplayer'
        });
        // Если текущий пользователь - это тот, кто покидает комнату
        if (player?.userid === userId) {
          const currentUrl = location.pathname;
          currentUrl !== roomsUrl && navigate(roomsUrl);
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
    // Сброс сообщений и блокировок выбора
    setMessageVisible(false);
    setIsChoiceLocked(false);
    setMessage('');

    sendMessage({
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: 'ready'
    });

    setAnyPlayerReady(true);
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
  };
  // хендлер выбора хода Websocket
  const handleChoice = (value: string) => {
    if (isChoiceLocked) return;

    setIsChoiceLocked(true);
    setShowTimer(false);

    const choice = {
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: value
    };

    sendMessage(choice);
    setAnyPlayerReady(true);
    setTimer(15);
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
  // Таймер
  useEffect(() => {
    if (data?.players_count === "2"
      && data?.players?.some((player: IPlayer) => player.choice === 'none')
      && data?.players?.some((player: IPlayer) => player.choice === 'ready')) {
      setTimerStarted(true);
      setShowTimer(true);
      // setTimer(15);
    } else if (data?.players?.every((player: IPlayer) => player.choice !== 'none')) {
      setTimerStarted(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else if (data?.players_count === "1") {
      setTimerStarted(false);
      setTimer(15);
    }
  }, [data]);
  // кик игрока, если он не прожал готовность 
  useEffect(() => {
    if (anyPlayerReady && timerStarted && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      data?.players.forEach((player: IPlayer) => {
        if (player.choice === 'none') {
          const leaveData = {
            user_id: player.userid,
            room_id: roomId,
            type: 'kickplayer'
          };

          sendMessage(leaveData);
          const currentUrl = location.pathname;
          currentUrl !== roomsUrl && navigate(roomsUrl);
        }
      });
      setTimerStarted(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer, timerStarted, anyPlayerReady, data, navigate, userId]);
  // сброс выбора игрока, когда он единственный в комнате Websocket
  useEffect(() => {
    const resetPlayerChoice = () => {
      const choiceData = {
        user_id: userId,
        room_id: roomId,
        type: 'choice',
        choice: 'none'
      };
      sendMessage(choiceData);
    };

    if (data?.players_count === "1" && data?.players.some((player: any) => player.choice !== 'none')) {
      resetPlayerChoice();
    }
  }, [data]);
  // обработчик клика по кнопке "Ознакомился" - не Websocket, но и не надо вроде
  const handleRuleButtonClick = () => {
    setGameRulesWatched(userId, '1');
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
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

  if (!isPortrait) {
    return (
      <Warning />
    );
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
                      {anyPlayerReady && showTimer && timerStarted && `0:${timer}`}
                    </p>
                  )}
                  <div className={styles.game__hands}>
                    {(
                      data?.players_count === "2"
                    ) ? (
                      <HandShake
                        player1={playersAnim.firstAnim || leftRock}
                        player2={playersAnim.secondAnim || rightRock} />
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
                        <p className={styles.game__text}>{data?.bet_type === "1" ? "💵" : "🔰"}</p>
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
        />
      </div>
    </div>
  );
};
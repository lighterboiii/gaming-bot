/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useCallback, useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { setGameRulesWatched, whoIsWinRequest } from "../../api/gameApi";
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
import { WebSocketContext } from '../../socket/WebSocketContext';
import { roomsUrl } from "../../utils/routes";
import { IGameData, IPlayer } from "../../utils/types/gameTypes";

import styles from "./RockPaperScissors.module.scss";

export const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const location = useLocation();
  // const userId = user?.id;
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
  const [timer, setTimer] = useState<number>(15);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showTimer, setShowTimer] = useState(true);
  const [rules, setRulesShown] = useState<boolean | null>(false);
  const [isChoiceLocked, setIsChoiceLocked] = useState<boolean>(false);
  const translation = useAppSelector(store => store.app.languageSettings);
  const isRulesShown = useAppSelector(store => store.app.firstGameRulesState);
  const ruleImage = useAppSelector(store => store.app.RPSRuleImage);
  const isPortrait = useOrientation();
  const { sendMessage, wsmessages, disconnect, clearMessages } = useContext(WebSocketContext)!;
  const currentPlayer = data?.players?.find((player: IPlayer) => Number(player?.userid) === Number(userId));
  // const [fetch, setFetch] = useState(false);
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      sendMessage({
        user_id: userId,
        room_id: roomId,
        type: 'kickplayer'
      });
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
      // setFetch(true);
    };

    // !fetch && 
    fetchInitialData();
  }, [
    // roomId,
    // userId
  ]);

  useEffect(() => {
    const messageHandler = (message: any) => {
      const res = JSON.parse(message);
      switch (res?.type) {
        case 'room_info':
          setData(res);
          setLoading(false);
          break;
        case 'whoiswin':
          setData(res?.room_info);
          console.log(res);
          if (data?.players?.every((player: IPlayer) => player.choice !== 'none')) {
          setPlayersAnim({
            firstAnim: res?.whoiswin.f_anim,
            secondAnim: res?.whoiswin.s_anim,
          });
          const animationTime = 3000;
          setAnimationKey(prevKey => prevKey + 1);
          setTimeout(() => {
            if (Number(res?.whoiswin.winner) === Number(userId)) {
              updateAnimation(Number(data?.creator_id) === Number(res?.whoiswin.winner) ? lWinAnim : rWinAnim);
              // postEvent(
              //   'web_app_trigger_haptic_feedback',
              //   { type: 'notification', notification_type: 'success' }
              // );
              setMessage(`${translation?.you_won} ${res?.whoiswin.winner_value !== 'none'
                ? `${res?.whoiswin.winner_value} ${data?.bet_type === "1" ? `💵`
                  : `🔰`}`
                : ''}`);
            } else if (Number(res?.whoiswin.winner_value) !== Number(userId) && res?.whoiswin.winner !== 'draw') {
              updateAnimation(Number(data?.creator_id) === Number(res?.whoiswin.winner) ? lLoseAnim : rLoseAnim);
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
              setShowTimer(true);
            }, 4000)
          }, animationTime);
        }
          // setLoading(false);
          break;
        case 'choice':
          console.log(res);
          setData(res);
          // setLoading(false);
          break;
        case 'emoji':
          setData(res);
          setData(res);
          // setLoading(false);
          break;
        case 'kickplayer':
          // clearMessages();
          // disconnect();
          // setTimeout(() => {
          //   const currentUrl = location.pathname;
          //   currentUrl !== roomsUrl && navigate(roomsUrl);
          // }, 500)
          break;
      }
    };
    const handleMessage = () => {
      wsmessages.forEach((message: any) => {
        messageHandler(message);
      });
    };

    handleMessage();
  }, [wsmessages]);
  // проверка правил при старте игры
  useEffect(() => {
    setRulesShown(isRulesShown);
  }, [dispatch, isRulesShown]);
  // useEffect(() => {
  //   if (data?.players?.every((player: IPlayer) => player?.choice !== 'none' && player?.choice !== 'ready')) {
  //     console.log('Все игроки сделали выбор:', data.players);
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //     }
  //     setShowTimer(false);
  //     if (roomId) {
  //       console.log('Отправка запроса whoiswin');
  //       sendMessage({
  //         user_id: userId,
  //         room_id: roomId,
  //         type: 'whoiswin'
  //       });
  //     }
  //   }
  // }, [data]);
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

    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
  };
  // хендлер выбора хода Websocket
  const handleChoice = (value: string) => {
    if (isChoiceLocked) return;
    setIsChoiceLocked(true);
    setTimerStarted(false);
    setShowTimer(false);
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
  // Таймер
  useEffect(() => {
    if (data?.players_count === "2" && showTimer
      && (data?.players?.some((player: IPlayer) => player.choice === 'none')
        || (data?.players?.some((player: IPlayer) => player.choice === 'ready')))) {
      if (!timerStarted) {
        setTimerStarted(true);
        setTimer(20);
      }

      setShowTimer(true);
    } else if (data?.players?.every((player: IPlayer) => player.choice === 'ready')) {
      setTimerStarted(false);
      setShowTimer(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else if (data?.players_count === "1") {
      setTimerStarted(false);
      setTimer(20);
    }
  }, [data]);
  // кик игрока, если он не прожал готовность
  useEffect(() => {
    if (showTimer && timerStarted && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      if (currentPlayer?.choice === 'none') {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer, timerStarted, navigate, userId]);
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
                      {showTimer && timerStarted && `0:${timer}`}
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
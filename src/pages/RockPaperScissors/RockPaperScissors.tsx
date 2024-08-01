/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { formatNumber } from "utils/additionalFunctions";

import { getPollingRequest, leaveRoomRequest, setGameRulesWatched, whoIsWinRequest } from "../../api/gameApi";
import { getAppData } from "../../api/mainApi";
import { userId } from "../../api/requestData";
import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";
import ChoiceBox from "../../components/Game/ChoiceBox/ChoiceBox";
import HandShake from '../../components/Game/HandShake/HandShake';
import Loader from "../../components/Loader/Loader";
import { Warning } from "../../components/OrientationWarning/Warning";
import Button from "../../components/ui/Button/Button";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useOrientation from "../../hooks/useOrientation";
import useSetTelegramInterface from "../../hooks/useSetTelegramInterface";
import useTelegram from "../../hooks/useTelegram";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import leftRock from '../../images/rock-paper-scissors/left_rock.png';
import rightRock from '../../images/rock-paper-scissors/right_rock.png';
import readyIcon from '../../images/rock-paper-scissors/user_ready_image.png';
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import lLoseAnim from '../../images/rock-paper-scissors/winlose/l_lose.png';
import lWinAnim from '../../images/rock-paper-scissors/winlose/l_win.png';
import rLoseAnim from '../../images/rock-paper-scissors/winlose/r_lose.png';
import rWinAnim from '../../images/rock-paper-scissors/winlose/r_win.png';
import { setFirstGameRulesState } from "../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { roomsUrl } from "../../utils/routes";
import { IRPSPlayer } from "../../utils/types/gameTypes";

import styles from "./RockPaperScissors.module.scss";

export const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const userId = user?.id;
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>(null);
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
  const userData = useAppSelector(store => store.app.info);
  const [rules, setRulesShown] = useState<boolean | null>(false);
  const [anyPlayerReady, setAnyPlayerReady] = useState<boolean>(false);
  const translation = useAppSelector(store => store.app.languageSettings);
  const isRulesShown = useAppSelector(store => store.app.firstGameRulesState);
  const ruleImage = useAppSelector(store => store.app.RPSRuleImage);
  const isPortrait = useOrientation();
  // установка первоначального вида рук и правил при старте игры
  useEffect(() => {
    setRulesShown(isRulesShown);
  }, [isRulesShown]);

  useEffect(() => {
    if (data?.players?.some((player: IRPSPlayer) => player.choice === 'ready')) {
      setAnyPlayerReady(true);
    } else {
      setAnyPlayerReady(false);
    }
  }, [data]);

  useSetTelegramInterface(roomsUrl, userId);

  // long polling
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    let isMounted = true;
    setLoading(true);
    const fetchRoomInfo = async () => {
      if (!roomId || !isMounted) {
        return;
      }
      const data = {
        user_id: userId,
        room_id: roomId,
        type: 'wait'
      };
      getPollingRequest(userId, data)
        .then((res: any) => {
          if (res?.message === 'None') {
            leaveRoomRequest(userId);
            isMounted = false;
            navigate(roomsUrl);
          } else if (res?.message === 'timeout') {
            setTimeout(fetchRoomInfo, 500);
          } else {
            setData(res);
            setLoading(false);
          }

          if (isMounted) {
            fetchRoomInfo();
          }
        })
        .catch((error) => {
          console.error('Room data request error', error);
          leaveRoomRequest(userId)
            .then((res: any) => {
              if (res?.message === 'success') {
                navigate(roomsUrl);
              }
            })
            .catch((error) => {
              console.log(error);
            })
        });
    };
    fetchRoomInfo();

    return () => {
      isMounted = false;
    };

  }, []);
  // запрос результата хода
  const updateAnimation = useCallback((newAnimation: any) => {
    setAnimation((prevAnimation: any) => {
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
        if (data?.players?.every((player: IRPSPlayer) => player?.choice !== 'none' && player?.choice !== 'ready')) {
          setShowTimer(false);
          if (roomId) {
            whoIsWinRequest(roomId)
              .then((res: any) => {
                setPlayersAnim({
                  firstAnim: res?.f_anim,
                  secondAnim: res?.s_anim,
                });
                const animationTime = 3000;
                setAnimationKey(prevKey => prevKey + 1);
                if (res?.message === "success") {
                  setTimeout(() => {
                    if (res?.winner === userId) {
                      updateAnimation(Number(data.creator_id) === Number(res.winner) ? lWinAnim : rWinAnim);
                      postEvent(
                        'web_app_trigger_haptic_feedback',
                        { type: 'notification', notification_type: 'success' }
                      );
                      setMessage(`${translation?.you_won} ${res?.winner_value !== 'none'
                        ? `${res?.winner_value} ${data?.bet_type === "1" ? `💵`
                          : `🔰`}`
                        : ''}`);
                    } else if (Number(res?.winner) !== Number(userId) && res?.winner !== 'draw') {
                      updateAnimation(Number(data.creator_id) === Number(res.winner) ? lLoseAnim : rLoseAnim);
                      postEvent(
                        'web_app_trigger_haptic_feedback',
                        { type: 'notification', notification_type: 'error', }
                      );
                      setMessage(`${translation?.you_lost} ${data?.bet} ${data?.bet_type === "1"
                        ? `💵`
                        : `🔰`}`);
                    } else if (res?.winner === 'draw') {
                      setMessage(translation?.draw);
                      postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
                    }
                    setMessageVisible(true);
                    setTimeout(() => {
                      setMessageVisible(false);
                      setAnimation(null);
                      setShowTimer(true);
                      setAnyPlayerReady(true);
                      setTimerStarted(true);
                      setTimer(15);
                      setPlayersAnim({
                        firstAnim: null,
                        secondAnim: null,
                      });
                    }, 4000)
                  }, animationTime);
                }
              })
              .catch((error) => {
                console.error('Data request error:', error);
              });
          }
        }
      }, 1500);
    };

    fetchData();
  }, [data, roomId, translation?.draw, translation?.you_lost, translation?.you_won, updateAnimation, userId]);
  // хендлер готовности игрока
  const handleReady = () => {
    const player = data?.players.find((player: any) => Number(player?.userid) === Number(userId));
    if (data?.bet_type === "1") {
      if (player?.money <= data?.bet) {
        leaveRoomRequest(player?.userid)
          .then(_res => {
            if (player?.userid === userId) {
              navigate(roomsUrl);
            }
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
          })
          .catch((error) => {
            console.log(error);
          })
      }
    } else if (data?.bet_type === "3") {
      if (player?.tokens <= data?.bet) {
        leaveRoomRequest(userId)
          .then(_res => {
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
          })
          .catch((error) => {
            console.log(error);
          })
      }
    }
    setMessageVisible(false);
    setMessage('');
    const reqData = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: 'ready'
    };
    getPollingRequest(userId, reqData)
      .then(res => {
        setData(res);
        setAnyPlayerReady(true);
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  // хендлер выбора хода
  const handleChoice = (value: string) => {
    setShowTimer(false);
    const reqData = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: value
    };
    getPollingRequest(userId, reqData)
      .then((res: any) => {
        setData(res);
        setShowTimer(true);
        setAnyPlayerReady(true);
        setTimerStarted(true);
        setTimer(15);
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
      })
      .catch((error) => {
        console.error('Set choice error:', error);
      });
  };
  // хендлер отпрвки эмодзи
  const handleEmojiSelect = (emoji: string) => {
    const data = {
      user_id: userId,
      room_id: roomId,
      type: 'setemoji',
      emoji: emoji
    }
    getPollingRequest(userId, data)
      .then(res => {
        setData(res);
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
        setShowEmojiOverlay(false);
      })
      .catch((error) => {
        console.log(error);
      })
    setTimeout(() => {
      const noneData = {
        user_id: userId,
        room_id: roomId,
        type: 'setemoji',
        emoji: 'none'
      }
      getPollingRequest(userId, noneData)
        .then(res => {
          setData(res);
        })
        .catch((error) => {
          console.log(error);
        })
    }, 3000)
  };
  // Таймер
  useEffect(() => {
    if (data?.players_count === "2" && data?.players?.some((player: IRPSPlayer) => player.choice === 'none')) {
      setTimerStarted(true);
      setTimer(15);
    } else if (data?.players?.every((player: IRPSPlayer) => player.choice !== 'none')) {
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
      data?.players.forEach((player: IRPSPlayer) => {
        if (player.choice === 'none') {
          leaveRoomRequest(player.userid)
            .then((res: any) => {
              if (res?.message === 'success' && player.userid === userId) {
                navigate(roomsUrl);
              }
            })
            .catch((error) => {
              console.log(error);
            });
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
  // сброс выбора игрока, когда он единственный в комнате
  useEffect(() => {
    const resetPlayerChoice = () => {
      const choiceData = {
        user_id: userId,
        room_id: roomId,
        type: 'setchoice',
        choice: 'none'
      };
      getPollingRequest(userId, choiceData)
        .then((_res: any) => {
        })
        .catch((error) => {
          console.error('Reset choice error:', error);
        });
    };

    if (data?.players_count === "1" && data?.players.some((player: any) => player.choice !== 'none')) {
      resetPlayerChoice();
    }
  }, [data]);
  // обработчик клика по кнопке "Ознакомился"
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
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
    setShowEmojiOverlay(true);
  };

  const handleCloseEmojiOverlay = () => {
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
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
                <div className={styles.game__players}>
                  {data?.players?.map((player: IRPSPlayer) => (
                    <div
                      className={styles.game__player}
                      key={player.userid}
                    >
                      <p className={styles.game__playerName}>{player?.publicname}</p>
                      <div className={styles.game__avatarWrapper}>
                        <UserAvatar
                          item={player}
                          avatar={player?.avatar}
                          key={player?.userid}
                        />
                      </div>
                      {player?.choice === 'ready' && (
                        <img
                          src={readyIcon}
                          alt="ready icon"
                          className={styles.game__readyIcon} />
                      )}
                      {Number(player?.userid) === Number(userId) && player?.choice !== 'ready' && (
                        <div className={styles.game__balance}>
                          {data?.bet_type === "1"
                            ? `💵 ${formatNumber(player?.money)}`
                            : `🔰 ${formatNumber(player?.money)}`
                          }
                        </div>
                      )}
                      {player?.emoji !== "none" && (
                        <motion.img
                          src={player.emoji}
                          alt="player emoji"
                          className={Number(player?.userid) === Number(data?.players[0]?.userid)
                            ? styles.game__selectedEmojiRight
                            : styles.game__selectedEmoji}
                          initial={{ scale: 0.1 }}
                          animate={{
                            scale: [0.1, 1.5, 1],
                            transition: {
                              duration: 1,
                              times: [0, 0.5, 1],
                            },
                          }} />
                      )}
                    </div>
                  ))}
                </div>
                <>
                  {data?.players_count === "2" &&
                    data?.players?.every((player: IRPSPlayer) => player?.choice === 'ready') &&
                    <img src={newVS}
                      alt="versus icon"
                      className={styles.game__versusImage} />}
                  {messageVisible ? (
                    <p className={styles.game__resultMessage}>
                      {message}
                    </p>
                  ) : (
                    <p className={styles.game__notify}>
                      {anyPlayerReady && showTimer && timerStarted && timer}
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
                    {(data?.players?.every((player: IRPSPlayer) => player?.choice !== 'none')
                      && data?.players_count === "2") ? (
                      <div className={styles.game__buttonsWrapper}>
                        <ChoiceBox choice={choice}
                          handleChoice={handleChoice} />
                      </div>
                    ) : (
                      <div>
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
              </>) : (
              <div className={styles.rules}>
                <img src={ruleImage ? ruleImage : ''}
                  alt="game rules"
                  className={styles.rules__image} />
                <div className={styles.rules__button}>
                  <Button text={translation?.understood} handleClick={handleRuleButtonClick} />
                </div>
              </div>
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
}
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-fallthrough */
import { postEvent } from "@tma.js/sdk";
import { FC, useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { getUserId } from "utils/userConfig";

import { setGameRulesWatched } from "../../api/gameApi";
import { getActiveEmojiPack, getAppData } from "../../api/mainApi";
import CircularProgressBar from "../../components/ClosestNumber/ProgressBar/ProgressBar";
import RenderComponent from "../../components/ClosestNumber/WhoCloserPlayers/WhoCloserPlayers";
import Rules from "../../components/Game/Rules/Rules";
import Loader from "../../components/Loader/Loader";
import { ClosestModal } from "../../components/Modal/ClosestModal/ClosestModal";
import { Warning } from "../../components/OrientationWarning/Warning";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useOrientation from "../../hooks/useOrientation";
import useTelegram from "../../hooks/useTelegram";
import approveIcon from '../../images/closest-number/Approve.png';
import deleteIcon from '../../images/closest-number/Delete.png';
import smile from '../../images/closest-number/smile.png';
import { setSecondGameRulesState } from "../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { WebSocketContext } from "../../socket/WebSocketContext";
import { formatNumber } from "../../utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "../../utils/constants";
import { indexUrl } from "../../utils/routes";

import styles from './ClosestNumber.module.scss';

export const ClosestNumber: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const location = useLocation();
  const userId = getUserId();
  const dispatch = useAppDispatch();
  const { roomId } = useParams<{ roomId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emojis, setEmojis] = useState<any>(null);
  const [roomValue, setRoomValue] = useState<number>(0);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [inputError, setInputError] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [winSum, setWinSum] = useState<any>(null);
  const [draw, setDraw] = useState(false);
  const [isChoiceLocked, setIsChoiceLocked] = useState<boolean>(false);
  const [drawWinners, setDrawWinners] = useState<any | null>(null);
  const currentWinner = data?.players?.find((player: any) => Number(player?.userid) === Number(winnerId));
  const currentPlayer = data?.players?.find((player: any) => Number(player?.userid) === Number(userId));
  const translation = useAppSelector(store => store.app.languageSettings);
  const [placeholder, setPlaceholder] = useState<string>(translation?.your_number_but);
  const userData = useAppSelector(store => store.app.info);
  const [rules, setRulesShown] = useState<boolean | null>(false);
  const isRulesShown = useAppSelector(store => store.app.secondGameRulesState);
  const ruleImage = useAppSelector(store => store.app.closestNumberRuleImage);
  const isPortrait = useOrientation();
  const { sendMessage, wsMessages, disconnect, clearMessages } = useContext(WebSocketContext)!;
  const [isProcessingWin, setIsProcessingWin] = useState<boolean>(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [isTimerShown, setIsTimerShown] = useState<boolean>(false);
  // установка правил при старте игры
  useEffect(() => {
    setRulesShown(isRulesShown);
  }, []);
  // получить эмодзи пользователя
  useEffect(() => {
    getActiveEmojiPack(userId)
      .then((res: any) => {
        setEmojis(res.user_emoji_pack.user_emoji_pack);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);
  // отображение игроков на поле за исключением пользователя
  useEffect(() => {
    if (data?.players) {
      const filtered = data.players.filter((player: any) => Number(player.userid) !== Number(userId));
      setFilteredPlayers(filtered);
    }
  }, [data, userId]);
  const count = data?.players?.reduce((total: number, player: any) => {
    return total + (player?.choice !== "none" ? 1 : 0);
  }, 0);

  useEffect(() => {
    tg.setHeaderColor('#FEC42C');
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
  // свернуть клавиатуру по клику за ее границами
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setShowOverlay(false);
      }
    };

    if (showOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOverlay]);
  //ws get data
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
  }, []);
  // обработчик сообщений ws
  useEffect(() => {
    const messageHandler = (message: any) => {
      const res = JSON.parse(message);
      switch (res?.type) {
        case 'room_info':
          setData(res);
          setLoading(false);
          setIsProcessingWin(false);
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
        case 'choice':
          setData(res);
          break;
        case 'emoji':
          setData(res);
          break;
        case 'whoiswin':
          if (isProcessingWin) return;
          setIsProcessingWin(true);

          if (res.whoiswin.winner === "draw") {
            setDraw(true);
            setRoomValue(Number(res?.whoiswin.room_value));
            const drawPlayerIds = res.whoiswin.draw_players;
            const drawPlayers = data?.players?.filter((player: any) =>
              drawPlayerIds.includes(player.userid));
            setDrawWinners(drawPlayers);
            setWinSum(Number(res?.whoiswin.winner_value));
          } else {
            setRoomValue(Number(res?.whoiswin.room_value));
            setWinnerId(Number(res?.whoiswin.winner));
            setWinSum(res?.whoiswin.winner_value);
            // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'heavy' });
          }
          
          setTimeout(() => {
            setInputValue('');
            setModalOpen(true);

            setTimeout(() => {
              clearMessages();
              setIsChoiceLocked(false);
              setModalOpen(false);
              setRoomValue(0);
            }, 3000);
          }, 5000);
          break;
        case 'timer_started':
          setIsTimerShown(true);
          handleTimer(res.timer_time);
          break;
        case 'timer_stopped':
          setIsTimerShown(false);
          if (timerInterval) {
            clearInterval(timerInterval);
          }
          setTimerInterval(null);
          setTimer(null);
          break;
      }
    };

    const handleMessage = () => {
      wsMessages.forEach((message: any) => {
        messageHandler(message);
      });
    };

    handleMessage();
  }, [wsMessages]);
  // показать оверлей при фокусе в инпуте
  const handleInputFocus = () => {
    setShowOverlay(true);
  };
  // внести значение кнопки в инпут
  const handleKeyPress = (key: number) => {
    setInputValue((prevValue) => {
      const newValue = prevValue + key.toString();
      const numValue = parseInt(newValue, 10);

      if (newValue.length > 1 && newValue.startsWith('0')) {
        setInputError(true);
      } else if (numValue >= 1 && numValue <= 100) {
        setInputError(false);
      } else {
        setInputError(true);
      }
      // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
      return newValue;
    });
  };
  // стереть символ из инпута
  const handleDeleteNumber = () => {
    setInputValue((prevValue) => {
      const newValue = prevValue.slice(0, -1);
      const numValue = parseInt(newValue, 10);
      if (newValue.startsWith('0')) {
        setInputError(true);
      } else if (newValue === '' || (numValue >= 1 && numValue <= 100)) {
        setInputError(false);
      } else {
        setInputError(true);
      }
      // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
      return newValue;
    });
  };
  // подтвердить введенное число
  const handleSubmit = () => {
    const numValue = parseInt(inputValue, 10);
    if (numValue >= 1 && numValue <= 100) {
      handleChoice(inputValue);
      setShowOverlay(false);
    } else {
      setInputError(true);
    }
  };
  // обработчик кликов по кнопкам клавиатуры оверлея
  const handleButtonClick = (key: number | string) => {
    if (typeof key === 'number') {
      handleKeyPress(key);
    } else {
      switch (key) {
        case `${translation?.game_but_erase}`:
          handleDeleteNumber();
          break;
        case `${translation?.game_but_done}`:
          handleSubmit();
          break;
        default:
          // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
          break;
      }
    }
  };
  // хендлер выбора хода websocket
  const handleChoice = (value: string) => {
    setDrawWinners(null);
    setDraw(false);
    if (data?.players?.length === 1) {
      setInputValue('');
      setPlaceholder(translation?.waiting4players);
      // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
      setTimeout(() => {
        setPlaceholder(translation?.your_number_but);
      }, 2000)
      return;
    }

    const player = data?.players.find((player: any) => Number(player?.userid) === Number(userId));
    if (data?.bet_type === "1") {
      if (player?.money <= data?.bet) {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });
        if (player?.userid === userId) {
          const currentUrl = location.pathname;
          currentUrl !== indexUrl && navigate(indexUrl);
        }
        // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
      }
    } else if (data?.bet_type === "3") {
      if (player?.tokens <= data?.bet) {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });
        // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
      }
    }
    if (isChoiceLocked) return;

    const choice = {
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: value
    };
    sendMessage(choice);
    setIsChoiceLocked(true);
  };
  // хендлер отпрвки эмодзи
  const handleEmojiSelect = (emoji: string) => {
    const setEmojiData = {
      user_id: userId,
      room_id: roomId,
      type: 'emoji',
      emoji: emoji
    }
    sendMessage(setEmojiData);
    setShowEmojiOverlay(false);
    setShowOverlay(false);

    setTimeout(() => {
      const noneChoice = {
        user_id: userId,
        room_id: roomId,
        type: 'emoji',
        emoji: 'none'
      }
      sendMessage(noneChoice);
    }, 4000)
  };
  // обработчик клика на иконку эмодзи websocket
  const handleClickEmoji = () => {
    setShowOverlay(true);
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
    showEmojiOverlay === true ? setShowEmojiOverlay(false) : setShowEmojiOverlay(true);
  };
  // обработчик клика по кнопке "Ознакомился"
  const handleRuleButtonClick = () => {
    setGameRulesWatched(userId, '2');
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
    setRulesShown(true);
    setTimeout(() => {
      getAppData(userId)
        .then((res) => {
          dispatch(setSecondGameRulesState(res.game_rule_2_show));
        })
        .catch((error) => {
          console.error('Get user data error:', error);
        })
    }, 1000);
  };

  // Timer logic
  const handleTimer = (initialTime: number) => {
    if (!timerInterval) {
      setTimer(initialTime);
      const newInterval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime === null || prevTime <= 1) {
            clearInterval(newInterval);
            setTimerInterval(null);
            return null;
          }
          return prevTime - 1;
        });
      }, 1000);
      setTimerInterval(newInterval);
    }
  };

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  if (!isPortrait) {
    return (
      <Warning />
    );
  }
  return (
    <div className={styles.game}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {rules ? (
            <>

              {data?.players?.length !== 1 ?
                <>
                  <div className={styles.game__betContainer}>
                    <p className={styles.game__bet}>
                      {translation?.game_bet_text}
                      <span className={styles.game__text}>
                        {data?.bet_type === "1" ? MONEY_EMOJI : SHIELD_EMOJI}
                      </span>
                      {data?.bet}
                    </p>
                  </div>
                  <div className={styles.game__centralContainer}>
                    <p className={styles.game__centralText}> {`${count}/${data?.players_count}`}</p>
                    {isTimerShown && timer !== null && (
                      <div className={styles.game__centralTimer}>
                        {timer}
                      </div>
                    )}
                    <CircularProgressBar 
                      progress={roomValue}
                    />
                  </div>
                  <RenderComponent users={filteredPlayers} />
                </> :
                <p
                  className={styles.game__text}
                  style={{
                    position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%'
                  }}>
                  {translation?.waiting4players}
                </p>
              }
              <div ref={overlayRef}
                className={`${styles.overlay} ${showOverlay ? styles.expanded : ''}`}>
                <div className={styles.overlay__inputWrapper}>
                  <div className={styles.overlay__avatarWrapper}>
                    {currentPlayer?.emoji && currentPlayer?.emoji !== 'none' && (
                      <div className={styles.overlay__playerEmoji}>
                        <img src={currentPlayer?.emoji}
                          alt="emoji"
                          className={styles.overlay__emojiImage} />
                      </div>
                    )}
                    <UserAvatar />
                    <p className={styles.overlay__name}>
                      {userData && userData?.publicname}
                    </p>
                  </div>
                  <div className={styles.overlay__inputContainer}>
                    {isChoiceLocked
                      ? <p className={styles.overlay__text}>{translation?.choice_made} {inputValue}</p>
                      :
                      <input
                        type="number"
                        placeholder={placeholder}
                        className={`${styles.overlay__input} ${inputError ? styles.overlay__invalidInput : ''}`}
                        value={inputValue}
                        onFocus={handleInputFocus}
                        readOnly
                      />}
                    <p className={styles.overlay__inputText}>{translation?.your_number_text}</p>
                    <div className={styles.overlay__userMoney}>
                      <span className={styles.overlay__text}>
                        {data?.bet_type === "1"
                          ? `${MONEY_EMOJI} ${currentPlayer?.money && formatNumber(currentPlayer?.money)}`
                          : `${SHIELD_EMOJI} ${currentPlayer?.tokens && formatNumber(currentPlayer?.tokens)}`}
                      </span>
                    </div>
                  </div>
                  <button className={styles.overlay__emojiButton}
                    onClick={handleClickEmoji}>
                    <img src={smile}
                      alt="smile_icon"
                      className={styles.overlay__smile} />
                  </button>
                </div>
                {showOverlay && (
                  <div className={showEmojiOverlay ? styles.overlay__emojis : styles.overlay__keyboard}>
                    {showEmojiOverlay ?
                      (<>
                        {emojis && emojis?.map((emoji: string, index: number) => (
                          <img
                            key={index}
                            src={emoji}
                            alt={`Emoji ${index}`}
                            className={styles.overlay__emoji}
                            onClick={() => handleEmojiSelect(String(index + 1))} />
                        ))}
                      </>
                      ) : (
                        [1, 2, 3, 4, 5, 6, 7, 8, 9,
                          `${translation?.game_but_erase}`, 0, `${translation?.game_but_done}`].map((key) => (
                            typeof key === 'number' ? (
                              <button
                                key={key}
                                className={styles.overlay__key}
                                onClick={() => handleButtonClick(key)}
                              >
                                {key}
                              </button>
                            ) : (
                              <div
                                key={key}
                                className={key === `${translation?.game_but_erase}` || data?.players?.length === 1
                                  ? styles.overlay__bottomLeftButton
                                  : styles.overlay__bottomRightButton}
                                onClick={() => handleButtonClick(key)}
                              >
                                {key === `${translation?.game_but_erase}` ? (
                                  <>
                                    <img src={deleteIcon}
                                      alt="delete icon"
                                      className={styles.overlay__icon} />
                                    <span>{translation?.game_but_erase}</span>
                                  </>
                                ) : (
                                  <>
                                    <img src={approveIcon}
                                      alt="done icon"
                                      className={styles.overlay__icon} />
                                    <span>{translation?.game_but_done}</span>
                                  </>
                                )}
                              </div>
                            ))))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <Rules
              handleRuleButtonClick={handleRuleButtonClick}
              ruleImage={ruleImage!}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <ClosestModal
          betType={data?.bet_type}
          gameValue={roomValue}
          closeModal={() => setModalOpen(false)}
          winner={currentWinner}
          winnerValue={winSum}
          isTie={draw && draw}
          tieWinners={drawWinners && drawWinners}
        />
      )}
    </div>
  );
};

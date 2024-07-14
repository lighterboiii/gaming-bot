/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-fallthrough */
import { postEvent } from "@tma.js/sdk";
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPollingRequest, leaveRoomRequest, setGameRulesWatched, whoIsWinRequest } from "../../api/gameApi";
import { getActiveEmojiPack, getAppData } from "../../api/mainApi";
import { userId } from "../../api/requestData";
import CaseEight from "../../components/ClosestNumber/Eight/Eight";
import CaseFour from "../../components/ClosestNumber/Five/Five";
import CaseThree from "../../components/ClosestNumber/Four/Four";
import Case from '../../components/ClosestNumber/One/CaseOne';
import CircularProgressBar from "../../components/ClosestNumber/ProgressBar/ProgressBar";
import CaseSeven from "../../components/ClosestNumber/Seven/Seven";
import OneByOne from "../../components/ClosestNumber/Single/Single";
import CaseSix from "../../components/ClosestNumber/Six/Six";
import CaseTwo from "../../components/ClosestNumber/Three/Three";
import Loader from "../../components/Loader/Loader";
import { ClosestModal } from "../../components/Modal/ClosestModal/ClosestModal";
import Button from "../../components/ui/Button/Button";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useTelegram from "../../hooks/useTelegram";
import approveIcon from '../../images/closest-number/Approve.png';
import deleteIcon from '../../images/closest-number/Delete.png';
import smile from '../../images/closest-number/smile.png';
import { setSecondGameRulesState } from "../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { roomsUrl } from "../../utils/routes";
import { IRPSPlayer } from "../../utils/types/gameTypes";

import styles from './ClosestNumber.module.scss';

interface IProps {
  users: IRPSPlayer[];
}

const RenderComponent: FC<IProps> = ({ users }) => {
  switch (users?.length) {
    case 1:
      return <OneByOne users={users} />;
    case 3:
      return <CaseTwo users={users} />;
    case 4:
      return <CaseThree users={users} />;
    case 5:
      return <CaseFour users={users} />;
    case 6:
      return <CaseSix users={users} />;
    case 7:
      return <CaseSeven users={users} />;
    case 8:
      return <CaseEight users={users} />;
    default:
      return <Case users={users} />
  }
};

export const ClosestNumber: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  // const userId = user?.id;
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
  const [timer, setTimer] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [winSum, setWinSum] = useState<any>(null);
  const [draw, setDraw] = useState(false);
  const [drawWinners, setDrawWinners] = useState<any | null>(null);
  const currentWinner = data?.players?.find((player: any) => Number(player?.userid) === Number(winnerId));
  const currentPlayer = data?.players?.find((player: any) => Number(player?.userid) === Number(userId));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const translation = useAppSelector(store => store.app.languageSettings);
  const [placeholder, setPlaceholder] = useState<string>(translation?.your_number_but);
  const userData = useAppSelector(store => store.app.info);
  const [rules, setRulesShown] = useState<boolean | null>(false);
  const isRulesShown = useAppSelector(store => store.app.secondGameRulesState);
  const ruleImage = useAppSelector(store => store.app.closestNumberRuleImage);
  // установка правил при старте игры
  useEffect(() => {
    setRulesShown(isRulesShown);
  }, []);
  // отображение игроков на поле за исключением пользователя
  useEffect(() => {
    if (data?.players) {
      const filtered = data.players.filter((player: any) => Number(player.userid) !== Number(userId));
      setFilteredPlayers(filtered);
    }
  }, [data, userId]);
  // базовые установки на кнопку "Назад" и цвет хидера
  useEffect(() => {
    tg.setHeaderColor('#FEC42C');
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      leaveRoomRequest(userId)
        .then((data) => { })
        .catch((error) => {
          console.log(error);
        })
      navigate(roomsUrl);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
    }

  }, [tg, navigate]);
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
  // long polling
  useEffect(() => {
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
          console.log(res);
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

  const count = data?.players?.reduce((total: number, player: any) => {
    return total + (player?.choice !== "none" ? 1 : 0);
  }, 0);
  // запрос результата кона
  useEffect(() => {
    let timeoutId: any;
    const fetchData = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (data?.players?.every((player: IRPSPlayer) => player?.choice !== 'none')) {
          setTimerStarted(false);
          whoIsWinRequest(roomId!)
            .then((res: any) => {
              console.log(res);
              if (res.winner === "draw") {
                setDraw(true);
                setRoomValue(Number(res?.room_value));
                const drawPlayerIds = res.draw_players;
                const drawPlayers = data?.players?.filter((player: any) =>
                  drawPlayerIds.includes(player.userid));
                console.log(drawPlayers);
                setDrawWinners(drawPlayers);
                setWinSum(Number(res?.winner_value));
              } else {
                setRoomValue(Number(res?.room_value));
                setWinnerId(Number(res?.winner));
                setWinSum(res?.winner_value);
                // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'heavy' });
              }
              if (res?.message === "success") {
                setTimeout(() => {
                  setInputValue('');
                  setModalOpen(true);
                }, 5000)
              }
            })
            .catch((error) => {
              console.error('Data request error:', error);
            });
        }
      }, 2500);
    };

    fetchData();
  }, [data, roomId]);
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
      postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
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
          postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
          break;
      }
    }
  };
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
  // хендлер выбора хода
  const handleChoice = (value: string) => {
    setDrawWinners(null);
    setDraw(false);
    if (data?.players?.length === 1) {
      setInputValue('');
      setPlaceholder(translation?.waiting4players);
      postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
      setTimeout(() => {
        setPlaceholder(translation?.your_number_but);
      }, 2000)
      return;
    }

    const player = data?.players.find((player: any) => Number(player?.userid) === Number(userId));
    if (data?.bet_type === "1") {
      if (player?.money <= data?.bet) {
        leaveRoomRequest(player?.userid)
          .then(res => {
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
          .then(res => {
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
          })
          .catch((error) => {
            console.log(error);
          })
      }
    }
    const choice = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: value
    };
    getPollingRequest(userId, choice)
      .then((res: any) => {
        setData(res);
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
      })
      .catch((error) => {
        console.error('Set choice error:', error);
      });
  };
  // хендлер отпрвки эмодзи
  const handleEmojiSelect = (emoji: string) => {
    const setEmojiData = {
      user_id: userId,
      room_id: roomId,
      type: 'setemoji',
      emoji: emoji
    }
    getPollingRequest(userId, setEmojiData)
      .then(res => {
        setData(res);
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
        setShowEmojiOverlay(false);
        setShowOverlay(false);
      })
      .catch((error) => {
        console.log(error);
      })
    setTimeout(() => {
      const empty = {
        user_id: userId,
        room_id: roomId,
        type: 'setemoji',
        emoji: 'none'
      }
      getPollingRequest(userId, empty)
        .then(res => {
          setData(res);
        })
        .catch((error) => {
          console.log(error);
        })
    }, 4000)
  };
  // обработчик клика на иконку эмодзи
  const handleClickEmoji = () => {
    setShowOverlay(true);
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
    showEmojiOverlay === true ? setShowEmojiOverlay(false) : setShowEmojiOverlay(true);
  };
  // Таймер
  useEffect(() => {
    if (data?.players_count !== "1" && data?.players?.every((player: IRPSPlayer) => player.choice === 'none')) {
      setTimerStarted(true);
      setTimer(30);
    } else if (data?.players?.every((player: IRPSPlayer) => player.choice !== 'none')) {
      setTimerStarted(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else if (data?.players_count === "1") {
      setTimerStarted(false);
      setTimer(30);
    }
  }, [data]);
  // кик игрока, если он не прожал готовность
  useEffect(() => {
    if (timerStarted && timer! > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev! - 1);
      }, 1000);
    } else if (timer === 0) {
      const currentPlayer = data?.players.find((player: IRPSPlayer) => Number(player.userid) === Number(userId));
      if (currentPlayer?.choice === 'none' && data?.win?.winner_id === "none") {
        leaveRoomRequest(userId)
          .then((res: any) => {
            if (res?.message === 'success') {
              navigate(roomsUrl);
            }
          })
          .catch((error) => {
            console.log(error);
          });
        setTimerStarted(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer, timerStarted, data, navigate, userId]);

  useEffect(() => {
    const resetPlayerChoice = () => {
      const choiceData = {
        user_id: userId,
        room_id: roomId,
        type: 'setchoice',
        choice: 'none'
      };
      getPollingRequest(userId, choiceData)
        .then(res => {
          setInputValue('');
        })
        .catch((error) => {
          console.error('Reset choice error:', error);
        });
    };
    if (data?.players_count === "1" && data?.players.some((player: any) => player.choice !== 'none')) {
      resetPlayerChoice();
    }
  }, [data, roomId, userId]);
  // обработчик клика по кнопке "Ознакомился"
  const handleRuleButtonClick = () => {
    setGameRulesWatched(userId, '2');
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
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
  return (
    <div className={styles.game}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {rules ? (
            <>
              {data?.players?.length === 1 ?
                <>
                  <div className={styles.game__betContainer}>
                    <p className={styles.game__bet}>
                      {translation?.game_bet_text}
                      <span className={styles.game__text}>
                        {data?.bet_type === "1" ? "💵" : "🔰"}
                      </span>
                      {data?.bet}
                    </p>
                  </div>
                  <div className={styles.game__centralContainer}>
                    <p className={styles.game__centralText}> {`${count}/${data?.players_count}`}</p>
                    <CircularProgressBar progress={roomValue ? roomValue : 0} />
                    <p className={styles.game__centralTimer}>{timer}</p>
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
                    <input
                      type="number"
                      placeholder={placeholder}
                      className={`${styles.overlay__input} ${inputError ? styles.overlay__invalidInput : ''}`}
                      value={inputValue}
                      onFocus={handleInputFocus}
                      readOnly
                    />
                    <p className={styles.overlay__inputText}>{translation?.your_number_text}</p>
                    <div className={styles.overlay__userMoney}>
                      <span className={styles.overlay__text}>
                        {data?.bet_type === "1" ? `💵 ${userData?.coins}` : `🔰 ${userData?.tokens}`}
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
            <div className={styles.rules}>
              <img src={ruleImage!} alt="game rules" className={styles.rules__image} />
              <div className={styles.rules__button}>
                <Button text={translation?.understood} handleClick={handleRuleButtonClick} />
              </div>
            </div>
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

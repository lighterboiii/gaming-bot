/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { getPollingRequest, leaveRoomRequest, whoIsWinRequest } from "../../api/gameApi";
import Loader from "../../components/Loader/Loader";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useTelegram from "../../hooks/useTelegram";
import { userId } from "../../api/requestData";
import styles from "./RockPaperScissors.module.scss";
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import readyIcon from '../../images/rock-paper-scissors/user_ready_image.png';
import HandShake from '../../components/Game/HandShake/HandShake';
import ChoiceBox from "../../components/Game/ChoiceBox/ChoiceBox";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";
import leftRock from '../../images/rock-paper-scissors/left_rock.png';
import rightRock from '../../images/rock-paper-scissors/right_rock.png';
import { IRPSPlayer } from "../../utils/types/gameTypes";
import { useAppSelector } from "../../services/reduxHooks";

const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  // const userId = user?.id;
  const { roomId } = useParams<{ roomId: string }>();

  const translation = useAppSelector(store => store.app.languageSettings);
  const userData = useAppSelector(store => store.app.info);
  const [data, setData] = useState<any>(null);
  const [choice, setChoice] = useState<string>('');
  // const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [leftRockImage, setLeftRockImage] = useState<string>('');
  const [rightRockImage, setRightRockImage] = useState<string>('');
  const [messageVisible, setMessageVisible] = useState(false);
  const [playersAnim, setPlayersAnim] = useState({ firstAnim: null, secondAnim: null });
  const [timer, setTimer] = useState<number>(15);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // установка первоначального вида рук при старте игры
  useEffect(() => {
    setLeftRockImage(leftRock);
    setRightRockImage(rightRock);
  }, []);
  // эффект при запуске для задания цвета хидера и слушателя события на кнопку "назад"
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show().onClick(() => {
      leaveRoomRequest(userId)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        })
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tg, navigate]);
  // long polling
  useEffect(() => {
    let isMounted = true;

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
          setData(res);
          if (res?.message === 'None') {
            leaveRoomRequest(userId);
            isMounted = false;
            navigate(-1);
          }

          if (res?.message === 'timeout') {
            fetchRoomInfo();
          }

          if (isMounted) {
            fetchRoomInfo();
          }
        })
        .catch((error) => {
          console.error('Room data request error', error);
          leaveRoomRequest(userId)
            .then((data) => {
              console.log(data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // показать/скрыть лоадер
  // useEffect(() => {
  //   if (data) {
  //     setLoading(false);
  //   } else if (data) {
  //     setLoading(true);
  //   }
  // }, [data])
  // запрос результата хода
  useEffect(() => {
    let timeoutId: any;
    const fetchData = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (data?.players?.some((player: IRPSPlayer) => player?.choice !== 'none' && player?.choice !== 'ready')) {
          whoIsWinRequest(roomId!)
            .then((res: any) => {
              console.log(res);
              setPlayersAnim({
                firstAnim: res?.f_anim,
                secondAnim: res?.s_anim,
              });
              const animationTime = 3000;

              if (res?.message === "success") {
                setTimeout(() => {
                  if (Number(res?.winner) === Number(userId)) {
                    setMessage(`${translation?.you_won} ${data?.win?.winner_value !== 'none' && data?.win?.winner_value}`);
                  } else if (Number(res?.winner) !== Number(userId) && res?.winner !== 'draw') {
                    setMessage(`${translation?.you_lost} ${data?.bet}`);
                  } else if (res?.winner === 'draw') {
                    setMessage(translation?.draw);
                  }
                  setMessageVisible(true);
                  setTimeout(() => {
                    setMessageVisible(false);
                    setTimerStarted(true);
                    setTimer(15);
                  }, 2000)
                }, animationTime);
              }
            })
            .catch((error) => {
              console.error('Data request error:', error);
            });
        }
      }, 1500);
    };

    fetchData();
  }, [data]);
  // запрос на кик юзера при недостатке средств для следующего хода
  useEffect(() => {
    const player = data?.players?.find((player: any) => Number(player?.userid) === Number(userId));
    if (data?.bet_type === "1") {
      if (player?.money <= data?.bet) {
        leaveRoomRequest(userId)
          .then(res => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          })
      }
    } else if (data?.bet_type === "3") {
      if (player?.tokens <= data?.bet) {
        leaveRoomRequest(userId)
          .then(res => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          })
      }
    }
  }, [data])
  // хендлер готовности игрока
  const handleReady = () => {
    setMessageVisible(false);
    setMessage('');
    const data = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: 'ready'
    };
    getPollingRequest(userId, data)
      .then(res => {
        setData(res);
      })
  };
  // хендлер выбора хода
  const handleChoice = (value: string) => {
    const player = data?.players.find((player: any) => Number(player?.userid) === Number(userId));
    if (data?.bet_type === "1") {
      if (player?.money <= data?.bet) {
        leaveRoomRequest(userId)
          .then(res => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          })
      }
    } else if (data?.bet_type === "3") {
      if (player?.tokens <= data?.bet) {
        leaveRoomRequest(userId)
          .then(res => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          })
      }
    }
    const reqData = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: value
    };
    getPollingRequest(userId, reqData)
      .then((res: any) => {
        setData(res);
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
    if (data?.players_count === "2"
      && data?.players?.every((player: IRPSPlayer) => player.choice === 'none')
      // && data?.win?.users === 'none'
    ) {
      setTimerStarted(true);
      setTimer(15);
    } else {
      setTimerStarted(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [data]);

  useEffect(() => {
    if (timerStarted && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      const player = data?.players.find((player: IRPSPlayer) => player.choice === 'none');
      if (player) {
        leaveRoomRequest(player.userid)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
  }, [timer, timerStarted, data]);

  return (
    <div className={styles.game}>
      {/* {loading ? <Loader /> : ( */}
      <>
        <div className={styles.game__players}>
          {data?.players?.map((player: IRPSPlayer) => (
            <div className={`${styles.game__player} ${Number(player?.userid) === Number(userId) ? styles.game__playerLeft : ''}`}>
              <p className={styles.game__playerName}>{player?.publicname}</p>
              <UserAvatar item={player} avatar={player?.avatar} key={player?.userid} />
              {player?.choice === 'ready' && (
                <img
                  src={readyIcon}
                  alt="ready icon"
                  className={styles.game__readyIcon}
                />
              )}
              {Number(player?.userid) === Number(userId) && (
                <div className={styles.game__balance}>
                  {data?.bet_type === "1" ? `💵 ${userData?.coins}` : `🔰 ${userData?.tokens}`}
                </div>
              )}
              {player?.emoji !== "none" && (
                <motion.img
                  src={player.emoji}
                  alt="player emoji"
                  className={Number(player?.userid) === Number(data?.players[0]?.userid)
                    ? styles.game__selectedEmojiRight
                    : styles.game__selectedEmoji
                  }
                  initial={{ scale: 0.1 }}
                  animate={{
                    scale: [0.1, 1.5, 1],
                    transition: {
                      duration: 1,
                      times: [0, 0.5, 1],
                    },
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <>
          {data?.players_count === "2" &&
            data?.players?.every((player: IRPSPlayer) => player?.choice === 'ready') &&
            <img src={newVS} alt="versus icon" className={styles.game__versusImage} />
          }
          {messageVisible ? (
            <p className={styles.game__resultMessage}>
              {message}
            </p>
          ) : (
            <p className={styles.game__notify}>
              {timerStarted && timer}
            </p>
          )}
          <div className={styles.game__hands}>
            {(
              data?.players_count === "2"
            ) ? (
              <HandShake
                userId={userId}
                prevChoices={{ player1: playersAnim.firstAnim || leftRockImage, player2: playersAnim.secondAnim || rightRockImage }}
              />
            ) : (
              data?.players_count === "1"
            ) ? (
              <p className={styles.game__notify}>Ожидание игроков...</p>
            ) :
              ''}
          </div>
          <div className={styles.game__lowerContainer}>
            <div className={styles.game__betContainer}>
              <p className={styles.game__text}>Ставка</p>
              <div className={styles.game__bet}>
                <p className={styles.game__text}>{data?.bet_type === "1" ? "💵" : "🔰"}</p>
                <p className={styles.game__text}>{data?.bet}</p>
              </div>
            </div>
            {(data?.players?.every((player: IRPSPlayer) => player?.choice !== 'none')) ? (
              <div className={styles.game__buttonsWrapper}>
                <ChoiceBox choice={choice} handleChoice={handleChoice} />
              </div>
            ) : (
              <div>
                <input
                  type="checkbox"
                  id="ready"
                  onChange={handleReady}
                  className={styles.game__checkbox}
                />
                <label htmlFor="ready" className={styles.game__label}></label>
              </div>

            )}
            <button
              type="button"
              className={`${styles.game__button} ${styles.game__emojiButton}`}
              onClick={() => setShowEmojiOverlay(true)}
            >
              <img src={emoji_icon} alt="emoji icon" className={styles.game__iconEmoji} />
            </button>
          </div>
        </>
      </>
      {/* )} */}
      <EmojiOverlay
        show={showEmojiOverlay}
        onClose={() => setShowEmojiOverlay(!showEmojiOverlay)}
        onEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
}

export default RockPaperScissors;
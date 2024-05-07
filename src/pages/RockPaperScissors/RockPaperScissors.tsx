/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
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
          setTimeout(fetchRoomInfo, 60000);
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
  useEffect(() => {
    let timeoutId: any;
    const fetchData = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (data?.players?.every((player: IRPSPlayer) => player?.choice !== 'none' && player?.choice !== 'ready')) {
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
                    setMessage(translation?.you_won);
                  } else if (Number(res?.winner) !== Number(userId) && res?.winner !== 'draw') {
                    setMessage(translation?.you_lost);
                  } else if (res?.winner === 'draw') {
                    setMessage(translation?.draw);
                  }
                  setMessageVisible(true);
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
    }, 2000)
  };

  // useEffect(() => {
  //   if (data && data?.players_count === '2' && !timerStarted) {
  //     setTimerStarted(true);
  //     setTimer(15);
  //   } else if (data && data?.players_count !== '2') {
  //     setTimerStarted(false);
  //     setTimer(15);
  //   }
  //   if (data?.players.every((player: any) => player.choice === 'ready')) {
  //     setTimerStarted(false);
  //     setTimer(15);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (timerStarted && timer > 0) {
  //     const ticker = setInterval(() => {
  //       setTimer(prevTimer => prevTimer - 1);
  //     }, 1000);
  //     return () => clearInterval(ticker);
  //   } else if (timer === 0) {
  //     const hasPlayerWithChoiceNone = data?.players.some((player: any) => player.choice === 'none');
  //     if (hasPlayerWithChoiceNone) {
  //       leaveRoomRequest(userId)
  //         .then((data) => {
  //           console.log(data);
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  //     }
  //     setTimerStarted(false);
  //     setTimer(15);
  //   }
  // }, [timerStarted, timer]);

  return (
    <div className={styles.game}>
      {/* {loading ? <Loader /> : ( */}
      <>
        <div className={styles.game__players}>
          {data?.players?.map((player: IRPSPlayer) => (
            <div className={styles.game__player} key={player?.userid}>
              <p className={styles.game__playerName}>{player?.publicname}</p>
              <UserAvatar item={player} avatar={player?.avatar} key={player?.userid} />
              {player?.choice === 'ready' && (
                <img
                  src={readyIcon}
                  alt="ready icon"
                  className={styles.game__readyIcon}
                />
              )}
              {player?.emoji !== "none" && (
                <img
                  src={player?.emoji}
                  alt="player emoji"
                  className={
                    Number(player?.userid) === Number(data?.players[0]?.userid) ?
                      styles.game__selectedEmoji :
                      styles.game__selectedEmojiRight
                  }
                />)}
            </div>
          ))}
        </div>
        <>
          {data?.players_count === "2" &&
            data?.players?.every((player: IRPSPlayer) => player?.choice === 'ready') &&
            <img src={newVS} alt="versus icon" className={styles.game__versusImage} />
          }
          {messageVisible && (
            <p className={styles.game__resultMessage}>
              {message}
            </p>
          )}
          {/* <div className={styles.game__hands}>
            {data?.players_count === "2" ? (
              <HandShake prevChoices={{ player1: playersAnim.firstAnim || leftRockImage, player2: playersAnim.secondAnim || rightRockImage }} />
            ) : data?.players_count === "1" ? (
              <p className={styles.game__notify}>Ожидание игроков...</p>
            ) : (
              data?.players.some((player: any) => player.choice === 'none') && timer && (
                <p className={styles.game__notify}>{timer}</p>
              )
            )}
          </div> */}

          <div className={styles.game__hands}>
            {(
              data?.players_count === "2"
            ) ? (
              <HandShake prevChoices={{ player1: playersAnim.firstAnim || leftRockImage, player2: playersAnim.secondAnim || rightRockImage }} />
            ) : (
              data?.players_count === "1"
            ) ? (
              <p className={styles.game__notify}>Ожидание игроков...</p>
            ) : (
              <p className={styles.game__notify}>
                {
                  data?.players?.some((player: any) => player.choice === 'none') &&
                  timer
                }
              </p>
            )}
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
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomInfoRequest, leaveRoomRequest, setChoiceRequest, setEmojiRequest, whoIsWinRequest } from "../../api/gameApi";
import Loader from "../../components/Loader/Loader";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useTelegram from "../../hooks/useTelegram";
import { roomIdParamString, userId } from "../../api/requestData";
import styles from "./RockPaperScissors.module.scss";
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import readyIcon from '../../images/rock-paper-scissors/user_ready_image.png';
import HandShake from '../../components/Game/HandShake/HandShake';
import ChoiceBox from "../../components/Game/ChoiceBox/ChoiceBox";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";
import { postReq } from "../../api/api";

const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const { roomId } = useParams<{ roomId: string }>();
  // const userId = user?.id;
  const [data, setData] = useState<any>(null);
  const [choice, setChoice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [emojiVisible, setEmojiVisible] = useState<boolean>(false);
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(15);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [playerEmoji, setPlayerEmoji] = useState<string>('');
  const [secPlayerEmoji, setSecPlayerEmoji] = useState<string>('');
console.log(data);
  // const [player1, setPlayer1] = useState(null);
  // const [player2, setPlayer2] = useState(null);
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
  }, [tg, navigate]);
  // long polling
  const getRoomInfoRequest = (userIdValue: string, data: any) => {
    return postReq({
      uri: 'polling?user_id=',
      userId: userIdValue,
      data: data,
    })
  };
  // useEffect(() => {
  //   const data = {
  //     user_id: userId,
  //     room_id: roomId,
  //     type: 'wait'
  //   };
  //   getRoomInfoRequest(userId, data)
  //     .then((res) => {
  //       console.log(res);
  //       setData(res);
  //     })
  // }, [roomId, userId])
  useEffect(() => {
    const fetchRoomInfo = async () => {
      const data = {
        user_id: userId,
        room_id: roomId,
        type: 'wait'
      };
      roomId && getRoomInfoRequest(userId, data)
        .then((res: any) => {
          console.log(res);
            setData(res);
            setTimeout(fetchRoomInfo, 60000);
        })
        .catch((error) => {
          console.error('Ошибка при получении информации о комнате', error);
          setTimeout(fetchRoomInfo, 60000);
        });
    };

    
    roomId && fetchRoomInfo();

    const timerId = setTimeout(fetchRoomInfo, 10000);
    return () => {
      clearTimeout(timerId);
    }
  }, [roomId, userId]);
  // useEffect(() => {
  //   const fetchRoomInfo = async () => {
  //     roomId && getRoomInfoRequest(userId,roomId)
  //       .then((res: any) => {
  //         console.log(res);
  //         if (res?.status !== 'no_update') {
  //           setData(res);
  //           setTimeout(fetchRoomInfo, 60000);
  //         } else if ( res?.status === 'no_update') {
  //           // setTimeout(fetchRoomInfo, 60000);
  //           fetchRoomInfo();
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Ошибка при получении информации о комнате', error);
  //         setTimeout(fetchRoomInfo, 60000);
  //       });
  //   };

    
  //   roomId && fetchRoomInfo();

  //   const timerId = setTimeout(fetchRoomInfo, 10000);
  //   return () => {
  //     clearTimeout(timerId);
  //   }
  // }, [roomId]);
  // подгрузка при монтировании компонента ??
  // useEffect(() => {
  //   // setLoading(true);
  //   roomId && getRoomInfoRequest(roomId)
  //     .then((res) => {
  //       setData(res);
  //       // setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Ошибка при получении информации о комнате', error);
  //     });
  // }, [])
  // // Функция для запуска таймера
  // const startTimer = () => {
  //   setTimerStarted(true);
  //   setTimer(15);
  // };

  // // Функция для остановки таймера
  // const stopTimer = () => {
  //   setTimerStarted(false);
  //   setTimer(15);
  // };
  // установка таймера
  // useEffect(() => {
  //   if (data && data?.players_count !== '2') {
  //     stopTimer();
  //   }
  //   if (data?.players?.every((player: any) => player.choice === 'ready')) {
  //     stopTimer();
  //   }
  //   if  (data && data?.players_count === '2') {
  //     startTimer();
  //   }
  // }, [data]);
  // установка таймера
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
  //           navigate(-1);
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  //     }
  //     startTimer();
  //   }
  // }, [timerStarted, timer]);
  // хендлер выбора хода
  const handleChoice = (value: string) => {
    const data = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: value
    };
    setChoiceRequest(userId, data)
      .then((res: any) => {
        console.log(res);
        // getRoomInfoRequest(roomId!)
          // .then((res: any) => {
        //     console.log(res)
        //     setData(res);
        //     if (res) {
              setTimeout(() => {
                whoIsWinRequest(roomId!)
                  .then((winData: any) => {
                    console.log(winData);
                    if (Number(winData?.winner?.userid) === Number(userId)) {
                      setMessage('Вы победили');
                    } else if ((Number(winData?.loser?.userid) === Number(userId))) {
                      setMessage('Вы проиграли');
                    } else if (winData?.winner === 'draw') {
                      setMessage('Ничья');
                    }
                    setTimeout(() => {
                      setChoice('');
                      setMessage('');
                    }, 2000)
                  })
              }, 3000)
        //     }
        //   })
      })
      .catch((error) => {
        console.error('Ошибка при установке выбора', error);
      });
  };
  // хендлер готовности игрока
  const handleReady = () => {
    const data = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: 'ready'
    };
    setChoiceRequest(userId, data)
      .then((data: any) => {
        console.log(data);
        // getRoomInfoRequest(roomId!)
        // .then((res: any) => {
        //   console.log(res)
        //   setData(res);
        // })
      })
  };
  // хендлер отпрвки эмодзи
  const handleEmojiSelect = (emoji: string) => {
    const data = {
      user_id: userId,
      room_id: roomId,
      type: 'setemoji',
      choice: emoji
    }
    setEmojiRequest(userId, data)
      .then((res: any) => {
        console.log(res);
        // if (res?.message === 'success') {
        //   setShowEmojiOverlay(false);
        //   setEmojiVisible(true);
        //   if (Number(res?.player_id) === Number(data?.creator_id)) {
        //     setPlayerEmoji(res?.emoji);
        //   } else if (Number(res?.player_id) === Number(data?.players[1]?.userid)) {
        //     setSecPlayerEmoji(res?.emoji);
        //   }
        // }
      })
      .catch((error) => {
        console.log(error);
      })
    setTimeout(() => {
      setEmojiVisible(false);
    }, 2500)
  };

  return (
    <div className={styles.game}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.game__players}>
            {data?.players?.map((player: any) => (
              <div className={styles.game__player} key={player?.userid}>
                <p className={styles.game__playerName}>{player?.publicname}</p>
                <UserAvatar item={player} avatar={player?.avatar} key={player?.userId} />
                {player && player?.choice === 'ready' && (
                  <img
                    src={readyIcon}
                    alt="ready icon"
                    className={styles.game__readyIcon}
                  />
                )}
                {emojiVisible && (
                  <img
                    src={player?.userid === Number(data?.players[0]?.userid) ? playerEmoji : secPlayerEmoji}
                    alt="player emoji"
                    className={
                      player?.userid === Number(data?.players[0]?.userid) ?
                        styles.game__selectedEmoji :
                        styles.game__selectedEmojiRight
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <>
            {data?.players_count === "2" &&
              data?.players?.every((player: any) => player?.choice === 'ready') &&
              <img src={newVS} alt="versus icon" className={styles.game__versusImage} />
            }
            <div className={styles.game__hands}>
              {(
                data?.players_count === "2" &&
                data?.players?.every((player: any) => player?.choice !== 'none' && player?.choice !== 'ready' )
              ) ? (
                <HandShake prevChoices={{ player1: data?.players[0]?.choice, player2: data?.players[1]?.choice }} />
              ) : (
                data?.players_count === "1"
              ) ? (
                <p className={styles.game__notify}>Ожидание игроков...</p>
              ) : (
                <p className={styles.game__resultMessage}>
                  {
                    timerStarted && timer > 0 ?
                      timer : message
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
              {(data?.players?.some((player: any) => player?.choice === 'none')) ? (
                <div>
                  <input
                    type="checkbox"
                    id="ready"
                    onChange={handleReady}
                    className={styles.game__checkbox}
                  />
                  <label htmlFor="ready" className={styles.game__label}></label>
                </div>
              ) : (
                <div className={styles.game__buttonsWrapper}>
                  <ChoiceBox choice={choice} handleChoice={handleChoice} />
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
      )}
      <EmojiOverlay
        show={showEmojiOverlay}
        onClose={() => setShowEmojiOverlay(!showEmojiOverlay)}
        onEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
}

export default RockPaperScissors;
/* eslint-disable react-hooks/exhaustive-deps */
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

const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const { roomId } = useParams<{ roomId: string }>();
  const userId = user?.id;
  const [data, setData] = useState<any>(null);
  const [choice, setChoice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [emojiVisible, setEmojiVisible] = useState<boolean>(false);
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(15);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
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

          if (isMounted) {
            fetchRoomInfo();
          }
          setTimeout(fetchRoomInfo, 10000)
        })
        .catch((error) => {
          console.error('Ошибка при получении информации о комнате', error);
          setTimeout(fetchRoomInfo, 60000);
        });
    };

    fetchRoomInfo();

    return () => {
      isMounted = false;
    };
  }, [roomId]);
  // показать/скрыть лоадер
  useEffect(() => {
    if (data) {
      setLoading(false);
    } else if (data) {
      setLoading(true);
    }
  }, [data])
  // проверка на выбор обоих игроков перед отправкой запроса на результат игры
  useEffect(() => {
    const bothPlayersMadeChoice = data?.players?.every((player: any) => player?.choice !== 'none' && player?.choice !== 'ready');
    console.log(bothPlayersMadeChoice);
    if (bothPlayersMadeChoice) {
      setTimeout(() => {
        roomId && whoIsWinRequest(roomId)
          .then((winData: any) => {
            console.log(winData);
            if (winData?.winner === 'draw') {
              setMessage('Ничья');
            }
            const currentUser = data?.players?.find((player: any) => Number(player?.userid) === Number(userId));
            if (currentUser) {
              console.log(currentUser);
              if (Number(winData?.winner?.userid) === Number(currentUser?.userid)) {
                setMessage('Вы победили');
              } else if (Number(winData?.winner?.userid) === Number(currentUser?.userid)) {
                setMessage('Вы проиграли');
              }
            }
            setTimeout(() => {
              setChoice('');
              setMessage('');
              const noneData = {
                user_id: userId,
                room_id: roomId,
                type: 'setchoice',
                choice: 'none'
              };
              getPollingRequest(userId, noneData)
            }, 2500)
          })
      }, 3000)
    }
  }, [data]);
  // хендлер выбора хода
  const handleChoice = (value: string) => {
    console.log(value);
    const reqData = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: value
    };
    getPollingRequest(userId, reqData)
      .then((res: any) => {
        console.log(res);
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
    getPollingRequest(userId, data)
      .then((data: any) => {
        console.log(data);
      })
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
      .then((res: any) => {
        console.log(res);
        setEmojiVisible(true);
        setData(res);
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
                {player?.choice === 'ready' && (
                  <img
                    src={readyIcon}
                    alt="ready icon"
                    className={styles.game__readyIcon}
                  />
                )}
                {emojiVisible && player?.emoji !== 'none' && (
                  <img
                    src={player?.emoji}
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
                data?.players?.every((player: any) => player?.choice !== 'none' && player?.choice !== 'ready')
              ) ? (
                <HandShake prevChoices={{ player1: data?.players[0]?.choice, player2: data?.players[1]?.choice }} />
              ) : (
                data?.players_count === "1"
              ) ? (
                <p className={styles.game__notify}>Ожидание игроков...</p>
              ) : (
                <p className={styles.game__resultMessage}>
                  {message}
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
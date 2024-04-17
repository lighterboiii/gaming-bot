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

const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const { roomId } = useParams<{ roomId: string }>();
  // const userId = user?.id;
  const [data, setData] = useState<any>(null);
  const [choice, setChoice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [leftRockImage, setLeftRockImage] = useState<string>('');
  const [rightRockImage, setRightRockImage] = useState<string>('');
  const [messageVisible, setMessageVisible] = useState(false);
  const [playersAnim, setPlayersAnim] = useState({ firstAnim: null, secondAnim: null });
  const [animationStarted, setAnimationStarted] = useState(false);
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
          console.error('Ошибка при получении информации о комнате', error);
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
  useEffect(() => {
    if (data) {
      setLoading(false);
    } else if (data) {
      setLoading(true);
    }
  }, [data])
  // хендлер выбора хода
  const handleChoice = (value: string) => {
    const reqData = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: value
    };
    getPollingRequest(userId, reqData)
      .then(res => {
        setData(res);
        // setAnimationStarted(false);
      })
      .catch((error) => {
        console.error('Ошибка при установке выбора', error);
      });
  };
  useEffect(() => {
    if (
      data?.players?.every(
        (player: IRPSPlayer) =>
          player?.choice !== 'none' && player?.choice !== 'ready'
      )
      // &&
      // !animationStarted
    ) {
      setTimeout(() => {
        whoIsWinRequest(roomId!)
          .then((res: any) => {
            console.log(res);
            setPlayersAnim({
              firstAnim: res?.f_anim,
              secondAnim: res?.s_anim
            });
            const animationTime = 3000;

            res?.message === "success" && setTimeout(() => {
              if (Number(res?.winner?.userid) === Number(userId)) {
                setMessage('Вы победили');
              } else if (Number(res?.loser?.userid) === Number(userId)) {
                setMessage('Вы проиграли');
              } else if (res?.winner === 'draw') {
                setMessage('Ничья');
              }
              setMessageVisible(true);

              const data = {
                user_id: userId,
                room_id: roomId,
                type: 'setchoice',
                choice: 'none'
              };
              getPollingRequest(userId, data)
                .then((res) => {
                  setData(res);
                  setMessageVisible(false);
                  setMessage('');
                });
            }, animationTime);
          });
        }, 3000);
        // setAnimationStarted(true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  // хендлер готовности игрока
  const handleReady = () => {
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
        console.log(res)
      })
      .catch((error) => {
        console.log(error);
      })
    setTimeout(() => {
      getPollingRequest(userId, data)
        .then(res => {
          setData(res);
        })
        .catch((error) => {
          console.log(error);
        })
    }, 2000)
  };

  return (
    <div className={styles.game}>
      {loading ? <Loader /> : (
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
                {data?.players?.some((player: IRPSPlayer) => player?.emoji !== 'none') && (
                  <img
                    src={player?.emoji}
                    alt="player emoji"
                    className={styles.game__selectedEmoji}
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
            {messageVisible && (
              <p className={styles.game__resultMessage}>
                {message}
              </p>
            )}
            <div className={styles.game__hands}>
              {(
                data?.players_count === "2"
              ) ? (
                <HandShake prevChoices={{ player1: playersAnim.firstAnim || leftRockImage, player2: playersAnim.secondAnim || rightRockImage }} />
              ) : (
                <p className={styles.game__notify}>Ожидание игроков...</p>
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
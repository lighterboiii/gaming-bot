/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomInfoRequest, leaveRoomRequest, setChoiceRequest, setUserChoice } from "../../api/gameApi";
import Loader from "../../components/Loader/Loader";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useTelegram from "../../hooks/useTelegram";
import { userId } from "../../api/requestData";
import styles from "./RockPaperScissors.module.scss";
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import readyIcon from '../../images/rock-paper-scissors/user_ready_image.png';
import { useAppDispatch } from "../../services/reduxHooks";
import HandShake from './HandShake/HandShake';
import ChoiceBox from "./ChoiceBox/ChoiceBox";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";

const RockPaperScissors: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const { roomId } = useParams<{ roomId: string }>();
  const userId = user?.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);

  console.log(data);
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show().onClick(() => {
      leaveRoomRequest(userId, roomId!)
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      getRoomInfoRequest(roomId!)
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.error('Ошибка при получении информации о комнате', error);
        });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);


  // useEffect(() => {
  //   getRoomInfoRequest(roomId!)
  //     .then((data) => {
  //       setData(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [data]);

  // хендлер выбора хода
  const handleChoice = (value: string) => {
    setChoiceRequest(userId, roomId!, value)
      .then((data) => {
        console.log(data);
      })
  };
  // хендлер готовности игрока
  const handleReady = () => {
    setChoiceRequest(userId, roomId!, 'ready')
      .then((data: any) => {
        console.log(data);
      })
  };
  // хендлер отпрвки эмодзи
  const handleEmojiSelect = (emoji: string) => {
  };

  return (
    <div className={styles.game}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.game__players}>
            {data?.players.map((player: any) => (
              <div className={styles.game__player}>
                <UserAvatar item={player} avatar={player.avatar} key={player.userId} />
                {player.choice === 'ready' && (
                  <img src={readyIcon} alt="ready icon" className={styles.game__readyIcon} />
                )}
              </div>
            ))}
          </div>
          <>
            <img src={newVS} alt="versus icon" className={styles.game__versusImage} />
            <div className={styles.game__hands}>
              {(data?.players[0]?.choice !== undefined && data?.players[1]?.choice !== undefined) && (
                <HandShake playerChoice={'paper'} secondPlayerChoice={'paper'} />
                )}
              </div>
            <div className={styles.game__lowerContainer}>
              {(data?.players.every((player: any) => player.choice === 'ready')) ? (
                <>
                  <div className={styles.game__betContainer}>
                    <p className={styles.game__text}>Ставка</p>
                    <div className={styles.game__bet}>
                      <p className={styles.game__text}>{data?.bet_type === "1" ? "💵" : "🔰"}</p>
                      <p className={styles.game__text}>{data?.bet}</p>
                    </div>
                  </div>
                  <div className={styles.game__buttonsWrapper}>
                    <ChoiceBox handleChoice={handleChoice} />
                  </div>
                </>
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
          {/* )} */}
        </>
      )}
      <EmojiOverlay
        show={showEmojiOverlay}
        onClose={() => setShowEmojiOverlay(!showEmojiOverlay)}
        onEmojiSelect={() => handleEmojiSelect}
      />
    </div>
  );
}

export default RockPaperScissors;

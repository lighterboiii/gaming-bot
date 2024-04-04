/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomInfoRequest, joinRoomRequest, leaveRoomRequest, setUserChoice } from "../../api/gameApi";
import Loader from "../../components/Loader/Loader";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useTelegram from "../../hooks/useTelegram";
import { userId } from "../../api/requestData";
import useWebSocketService from "../../services/webSocketService";
import styles from "./RockPaperScissors.module.scss";
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import readyIcon from '../../images/rock-paper-scissors/user_ready_image.png';
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
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
  const roomData = useAppSelector(store => store.ws.socket);
  const webSocketService = useWebSocketService<any>(`wss://gamebottggw.ngrok.app/room`);
  // задать и сбросить цвет шапки + backButton
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show().onClick(() => {
      webSocketService.sendMessage({ type: 'kickplayer', user_id: userId, room_id: roomId  });
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
    }
  }, [tg, navigate]);
  // подключиться по ws
  useEffect(() => {
    webSocketService.setMessageHandler((message) => {
      setData(message?.room_data);
      console.log('Получено сообщение:', message);
    });
  }, [webSocketService]);

  useEffect(() => {
    // setData(roomData);
    webSocketService.sendMessage({ type: 'room_info', room_id: roomId  });
    getRoomInfoRequest(roomId!)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // хендлер выбора хода
  const handleChoice = (value: string) => {
    webSocketService.sendMessage({ type: 'choice', user_id: userId, room_id: roomId, choice: value });
  };
  // хендлер готовности игрока
  const handleReady = () => {
    webSocketService.sendMessage({ type: 'choice', user_id: userId, room_id: roomId, choice: 'ready' });
  };
  // хендлер отпрвки эмодзи
  const handleEmojiSelect = (emoji: string) => {
    webSocketService.sendMessage({ type: 'emoji', user_id: userId, room_id: roomId, emoji: emoji });
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
              <img src={newVS} alt="versus icon" className={styles.game__versusImage} /><div className={styles.game__hands}>
                {/* {(player1State?.choice !== undefined && player2State?.choice !== undefined) && ( */}
                  <HandShake playerChoice={'paper'} secondPlayerChoice={'paper'} />
                {/* )} */}
              </div>
              <div className={styles.game__lowerContainer}>
                {(data?.players[0]?.choice === 'ready' && data?.players[1]?.choice === 'ready') ? (
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

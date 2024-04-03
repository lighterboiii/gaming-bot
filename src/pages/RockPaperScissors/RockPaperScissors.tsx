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
  // const userId = user?.id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState<string>('none');
  const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);
  const [roomData, setRoomData] = useState<any>(null); // https
  const [wsMessage, setWsMessage] = useState<any>(null);

  console.log(data?.players);
  console.log(wsMessage);
  const webSocketService = useWebSocketService<any>(`wss://gamebottggw.ngrok.app/room`);
  const isUserCreator = Number(userId) === Number(roomData?.creator_id);
  // задать и сбросить цвет шапки + backButton
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show().onClick(() => {
      navigate(-1);
      leaveRoomRequest(userId, roomId!)
        .then((res) => {
          console.log('Вы отключены от комнаты', res)
        })
        .catch((error: any) => {
          console.log('Ошибка', error);
        })
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
      setWsMessage(message);
      console.log('Получено сообщение:', message);
    });
  }, [webSocketService]);
  // получить даныне о комнате при входе в игру
  useEffect(() => {
    setLoading(true);
    getRoomInfoRequest(roomId!)
      .then((data) => {
        setRoomData(data);
        setLoading(false);
        const isUserInRoom = roomData.players.some((player: any) => player.userid === userId);
        if (!isUserCreator && !isUserInRoom) {
          joinRoomRequest(userId, roomId!)
            .then((res) => {
              console.log("Присоединение к комнате выполнено успешно:", res);
            })
            .catch((error) => {
              console.error("Ошибка при присоединении к комнате:", error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isUserCreator, roomId]);
  // хендлер выбора хода
  const handleChoice = (value: string) => {
    setChoice(value);
    webSocketService.sendMessage({ type: 'choice', user_id: userId, room_id: roomId, choice: value });
    webSocketService.sendMessage({ type: 'choice', user_id: 116496831, room_id: roomId, choice: 'paper' });
    setTimeout(() => {
      webSocketService.sendMessage({ type: 'whoiswin', room_id: roomId });
    }, 2500)
  };
  // хендлер готовности игрока
  const handleReady = () => {
    setChoice('ready');
    webSocketService.sendMessage({ type: 'choice', user_id: userId, room_id: roomId, choice: 'ready' });
  };

  return (
    <div className={styles.game}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.game__players}>
            {roomData?.players.map((player: any) => (
              <div className={styles.game__player}>
                <UserAvatar item={player} avatar={player.avatar} key={player.userId} />
                {player.choice === 'ready' && (
                  <img src={readyIcon} alt="ready icon" className={styles.game__readyIcon} />
                )}
              </div>
            ))}
          </div>
          <img src={newVS} alt="versus icon" className={styles.game__versusImage} />
          <div className={styles.game__hands}>
            {(data?.players[0].choice !== undefined && data?.players[1].choice !== undefined) && (
              <HandShake playerChoice={data?.players[0].choice} secondPlayerChoice={data?.players[1].choice} />
            )}
          </div>
          {wsMessage?.winner && (
            <div className={styles.game__resultMessage}>
              {wsMessage.winner?.userid === Number(userId) && <p>Поздравляем! Вы выиграли!</p>}
              {wsMessage.loser?.userid === Number(userId) && <p>К сожалению, вы проиграли.</p>}
              {wsMessage.winner === 'draw' && <p>Ничья!</p>}
            </div>
          )}
          <div className={styles.game__lowerContainer}>
            {choice === 'ready' ? (
              <>
                <div className={styles.game__betContainer}>
                  <p className={styles.game__text}>Ставка</p>
                  <div className={styles.game__bet}>
                    <p className={styles.game__text}>{roomData?.bet_type === "1" ? "💵" : "🔰"}</p>
                    <p className={styles.game__text}>{roomData?.bet}</p>
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
      )}
      <EmojiOverlay
        show={showEmojiOverlay}
        onClose={() => setShowEmojiOverlay(!showEmojiOverlay)}
      />
    </div>
  );
}

export default RockPaperScissors;

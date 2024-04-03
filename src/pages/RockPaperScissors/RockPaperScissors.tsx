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
  const [player1State, setPlayer1State] = useState<any>(null);
  const [player2State, setPlayer2State] = useState<any>(null);
  const [wsMessage, setWsMessage] = useState<any>(null);
  console.log(player1State);
  console.log(player2State);
  console.log(roomData);
  console.log(data);
  // console.log(wsMessage);
  const webSocketService = useWebSocketService<any>(`wss://gamebottggw.ngrok.app/room`);
  // const isUserCreator = Number(userId) === Number(roomData?.creator_id);
  // задать и сбросить цвет шапки + backButton
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show().onClick(() => {
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
      setPlayer1State(message?.room_data.players[0]);
      setPlayer2State(message?.room_data.players[1]);
      setWsMessage(message);
      // console.log('Получено сообщение:', message);
    });
  }, [webSocketService]);
  // получить даныне о комнате при входе в игру
  useEffect(() => {
    setLoading(true);
    // const isUserCreator = roomData && Number(userId) === Number(roomData.creator_id);
    // const isUserInRoom = roomData?.players.some((player: any) => Number(player.userid) === Number(userId));
    getRoomInfoRequest(roomId!)
      .then((data) => {
        setRoomData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [roomId]);
  useEffect(() => {
    setLoading(true);
    // const isUserCreator = roomData && Number(userId) === Number(roomData.creator_id);
    // const isUserInRoom = roomData?.players.some((player: any) => Number(player.userid) === Number(userId));
    getRoomInfoRequest(roomId!)
      .then((data) => {
        setRoomData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (roomData) {
      setPlayer1State(roomData.players[0]);
      setPlayer2State(roomData.players[1]);
    }
  }, [roomData]);
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
  // хендлер отпрвки эмодзи
  const handleEmojiSelect = (emoji: string) => {
    webSocketService.sendMessage({ type: 'emoji', user_id: userId, room_id: roomId, emoji: emoji });
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
          {(roomData?.players_count === "1") ? (
            <div className={styles.game__notify}>Ожидание игрока...</div> // перевод
          ) : (
            <>
              <img src={newVS} alt="versus icon" className={styles.game__versusImage} /><div className={styles.game__hands}>
                {(player1State?.choice !== undefined && player2State?.choice !== undefined) && (
                  <HandShake playerChoice={player1State.choice} secondPlayerChoice={player2State.choice} />
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

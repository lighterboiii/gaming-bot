/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomInfoRequest, setUserChoice } from "../../api/gameApi";
import { RootState } from "../../services/store";
import Loader from "../../components/Loader/Loader";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useTelegram from "../../hooks/useTelegram";
import { userId } from "../../api/requestData";
import useWebSocketService from "../../services/webSocketService";
import styles from "./RockPaperScissors.module.scss";
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import readyIcon from '../../images/rock-paper-scissors/user_ready_image.png';
import { useAppSelector } from "../../services/reduxHooks";
import { setSocket } from "../../services/wsSlice";
import HandShake from './HandShake/HandShake';
import ChoiceBox from "./ChoiceBox/ChoiceBox";

const RockPaperScissors: FC = () => {
  const { tg, user } = useTelegram();
  const dispatch = useDispatch();
  const { roomId } = useParams<{ roomId: string }>();
  const [roomData, setRoomData] = useState<any>(null); // https
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState('none');
  const navigate = useNavigate();
  const webSocketService = useWebSocketService<any>(`wss://gamebottggw.ngrok.app/room`);
  const socket = useAppSelector(store => store.ws.socket);
  const [message, setMessage] = useState<any>(null);
  console.log(data?.players[0].choice);
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, [tg, navigate]);

  useEffect(() => {
    webSocketService.setMessageHandler((message) => {
      setMessage(message);
      setData(message?.room_data);
      console.log('Получено сообщение:', message);
    });
  }, [webSocketService]);

  useEffect(() => {
    dispatch(setSocket(socket));

    return () => {
      socket?.close();
    };
  }, [dispatch, socket]);

  useEffect(() => {
    setLoading(true);
    getRoomInfoRequest(roomId!)
      .then((data) => {
        setRoomData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [roomId]);

  const handleChoice = (value: string) => {
    setChoice(value);
    webSocketService.sendMessage({ type: 'choice', user_id: userId, room_id: roomId, choice: value });
    webSocketService.sendMessage({ type: 'choice', user_id: 5858080651, room_id: roomId, choice: 'paper' });
    
    setTimeout(() => {
    webSocketService.sendMessage({ type: 'whoiswin', room_id: roomId });
      // webSocketService.sendMessage({ type: 'choice', user_id: userId, room_id: roomId, choice: 'none' });
    }, 5000)
  };

  const handleReady = () => {
    setChoice('ready');
    webSocketService.sendMessage({ type: 'choice', user_id: userId, room_id: roomId, choice: 'ready' });
  }

  return (
    <div className={styles.game}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.game__players}>
            {roomData?.players.map((player: any) => (
              <div className={styles.game__player}>
                <UserAvatar item={player} avatar={player.avatar} key={player.userId} />
                {message?.choice === 'ready' && (
                  <img src={readyIcon} alt="ready icon" className={styles.game__readyIcon} />
                )}
              </div>
            ))}
          </div>
          <img src={newVS} alt="versus icon" className={styles.game__versusImage} />
          {choice !== 'none' && (
            <div className={styles.game__hands}>
              {data?.players.map((player: any, index: number) => (
                <HandShake key={index} playerChoice={player?.choice} secondPlayerChoice={player?.choice} />
              ))}
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
                <label htmlFor="ready" className={styles.game__label}>
                  <p>готовы?</p>
                </label>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RockPaperScissors;

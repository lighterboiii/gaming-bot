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
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
// import leftHand from '../../images/rock-paper-scissors/l-pp.png'
// import rightHand from '../../images/rock-paper-scissors/r-rr.png';
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import rock from '../../images/rock-paper-scissors/hands-icons/rock.png'
import rockDeselect from '../../images/rock-paper-scissors/hands-icons/rock_deselect.png'
import rockSelect from '../../images/rock-paper-scissors/hands-icons/rock_select.png'
import paper from '../../images/rock-paper-scissors/hands-icons/paper.png'
import paperDeselect from '../../images/rock-paper-scissors/hands-icons/paper_deselect.png'
import paperSelect from '../../images/rock-paper-scissors/hands-icons/paper_select.png'
import scissors from '../../images/rock-paper-scissors/hands-icons/scissors.png'
import scissorsDeselect from '../../images/rock-paper-scissors/hands-icons/scissors_deselect.png'
import scissorsSelect from '../../images/rock-paper-scissors/hands-icons/scissors_select.png'
import readyIcon from '../../images/rock-paper-scissors/user_ready_image.png';
import { useAppSelector } from "../../services/reduxHooks";
import { setSocket } from "../../services/wsSlice";
import HandShake from './HandShake';

const RockPaperScissors: FC = () => {
  const dispatch = useDispatch();
  const { roomId } = useParams<{ roomId: string }>();
  const [roomData, setRoomData] = useState<any>(null); // не вебсокет
  const [loading, setLoading] = useState(false);
  const { tg, user } = useTelegram();
  const [choice, setChoice] = useState('none');
  console.log(roomData);
  const navigate = useNavigate();
  const webSocketService = useWebSocketService<any>(`wss://gamebottggw.ngrok.app/room`);
  const socket = useAppSelector(store => store.ws.socket);
  const [message, setMessage] = useState<any>(null);
  // console.log(message?.choice);
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
      console.log('Received message:', message);
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
    // setTimeout(() => {
    //   webSocketService.sendMessage({ type: 'choice', user_id: userId, room_id: roomId, choice: 'none' });
    // }, 5000)
  };

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
              <HandShake playerChoice={choice} secondPlayerChoice={choice} />
              {/* <img src={leftHand} alt="left hand" className={`${styles.game__mainImage} ${styles.game__leftMainImage}`} />
              <img src={rightHand} alt="right hand" className={`${styles.game__mainImage} ${styles.game__rightMainImage}`} /> */}
            </div>)}
          {/* ) : ( */}
            {/* <p className={styles.game__notify}>Ожидание игроков</p> */}
          {/* )} */}
          <div className={styles.game__lowerContainer}>
            {choice === 'ready' ? (
              <>
                <div className={styles.game__betContainer}>
                  <p className={styles.game__text}>Ставка</p>
                  <div className={styles.game__bet}>
                    <p className={styles.game__text}>{roomData?.bet_type === "1" ? "💵" : "🔰"}</p>
                    <p className={styles.game__text}>{roomData?.bet}</p>
                  </div>
                </div><div className={styles.game__buttonsWrapper}>
                  <div className={styles.game__choiceBox}>
                    <button
                      type="button"
                      className={styles.game__button}
                      onClick={() => handleChoice('rock')}
                    >
                      <img src={rock} alt="rock icon" className={styles.game__icon} />
                    </button>
                    <button
                      type="button"
                      className={styles.game__button}
                      onClick={() => handleChoice('scissors')}
                    >
                      <img src={scissors} alt="scissors icon" className={styles.game__icon} />
                    </button>
                    <button
                      type="button"
                      className={styles.game__button}
                      onClick={() => handleChoice('paper')}
                    >
                      <img src={paper} alt="paper icon" className={styles.game__icon} />
                    </button>
                    <button type="button" className={`${styles.game__button} ${styles.game__emojiButton}`}>
                      <img src={emoji_icon} alt="emoji icon" className={styles.game__iconEmoji} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <input
                  type="checkbox"
                  id="ready"
                  onChange={() => handleChoice('ready')}
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

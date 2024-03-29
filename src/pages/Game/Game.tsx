/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import useTelegram from "../../hooks/useTelegram";
import styles from './Game.module.scss';
import { useNavigate, useParams } from "react-router-dom";
import { getRoomInfoRequest } from "../../api/gameApi";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import leftHand from '../../images/rock-paper-scissors/l-pp.webp'
import rightHand from '../../images/rock-paper-scissors/r-rr.webp';
import versus from '../../images/rock-paper-scissors/VS.webp';
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

// типизировать
const Game: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { roomId } = useParams<any>();
  const [roomData, setRoomData] = useState<any>(null);
  const { user } = useTelegram();
  const [choice, setChoice] = useState('');
  const navigate = useNavigate();
  console.log(roomId);
  console.log(roomData);
  useEffect(() => {
    getRoomInfoRequest(roomId!)
      .then((data) => {
        setRoomData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [roomId]);

  const handleChoice = (value: string) => {
    setChoice(value);
  }

  return (
    <div className={styles.game}>
      <div className={styles.game__players}>
        {roomData?.players.map((player: any) => (
          <div className={styles.game__player}>
            <UserAvatar item={player} avatar={player.avatar} />
          </div>
        ))}
      </div>
      <img src={newVS} alt="versus icon" className={styles.game__versusImage} />
      <div className={styles.game__hands}>
        <img src={leftHand} alt="left hand" className={`${styles.game__mainImage} ${styles.game__leftMainImage}`} />
        <img src={rightHand} alt="right hand" className={`${styles.game__mainImage} ${styles.game__rightMainImage}`} />
      </div>
      <div className={styles.game__lowerContainer}>
        <div className={styles.game__betContainer}>
          <p className={styles.game__text}>Ставка</p>
          <div className={styles.game__bet}>
            <p className={styles.game__text}>{roomData?.bet_type === 1 ? "💵" : "🔰"}</p>
            <p className={styles.game__text}>{roomData?.bet}</p>
          </div>
        </div>
        <div className={styles.game__buttonsWrapper}>
          <div className={styles.game__choiceBox}>
            <button
              type="button"
              className={styles.game__button}
              >
              <img src={rock} alt="rock icon" className={styles.game__icon} 
              />
            </button>
            <button
              type="button"
              className={styles.game__button}>
              <img src={scissors} alt="scissors icon" className={styles.game__icon} />
            </button>
            <button
              type="button"
              className={styles.game__button}>
              <img src={paper} alt="paper icon" className={styles.game__icon} />
            </button>
            <button type="button" className={`${styles.game__button} ${styles.game__emojiButton}`}>
              <img src={emoji_icon} alt="emoji icon" className={styles.game__icon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game;
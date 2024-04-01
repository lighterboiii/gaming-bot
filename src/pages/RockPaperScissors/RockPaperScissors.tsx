/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import useTelegram from "../../hooks/useTelegram";
import styles from './RockPaperScissors.module.scss';
import { useNavigate, useParams } from "react-router-dom";
import { getRoomInfoRequest, setUserChoice } from "../../api/gameApi";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import leftHand from '../../images/rock-paper-scissors/l-pp.png'
import rightHand from '../../images/rock-paper-scissors/r-rr.png';
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
import Loader from "../../components/Loader/Loader";
import readyIcon from '../../images/rock-paper-scissors/user_ready_image.png';
import { userId } from "../../api/requestData";

// типизировать
const Game: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { roomId } = useParams<string>();
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { tg, user } = useTelegram();
  // const userId = user?.id;
  const [choice, setChoice] = useState('');
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  console.log(roomData);
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setUserChoice(userId, roomData?.room_id, "rock")
      .then((res: any) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className={styles.game}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.game__players}>
            {roomData?.players.map((player: any) => (
              <div className={styles.game__player}>
                <UserAvatar item={player} avatar={player.avatar} key={player.userId} />
                {(ready || choice) && <img src={readyIcon} alt="ready icon" className={styles.game__readyIcon} />}
              </div>
            ))}
          </div>
          <img src={newVS} alt="versus icon" className={styles.game__versusImage} />
          {choice ? (
            <div className={styles.game__hands}>
              <img src={leftHand} alt="left hand" className={`${styles.game__mainImage} ${styles.game__leftMainImage}`} />
              <img src={rightHand} alt="right hand" className={`${styles.game__mainImage} ${styles.game__rightMainImage}`} />
            </div>
          ) : (
            <p className={styles.game__notify}>Ожидание игроков</p>
          )}
          <div className={styles.game__lowerContainer}>
            {ready && roomData?.free_places === "0" ? (
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
                      onClick={() => handleChoice('2')}
                    >
                      <img src={rock} alt="rock icon" className={styles.game__icon} />
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
                  checked={ready}
                  onChange={(e) => setReady(e.target.checked)}
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
  )
}

export default Game;
import { FC } from "react";
import styles from './Room.module.scss';
import hand from '../../../images/main_hand_1_tiny.png';
import whoCloser from '../../../images/gameSec.png';
import { useNavigate } from "react-router-dom";
import ManIcon from "../../../icons/Man/Man";
// типизировать
interface IProps {
  room: any;
}

const Room: FC<IProps> = ({ room }) => {
  console.log(room);
  const navigate = useNavigate();
  return (
    <div className={styles.room} onClick={() => navigate('/4')} key={room?.id}>
      <div className={styles.room__game}>
        <p className={styles.room__gameName}>
          {room?.room_id === 1 ? "Цу-Е-ФА" : "Кто ближе"}
        </p>
        <img src={room?.room_id === 1 ? hand : whoCloser} alt="game-logo" className={styles.room__image} />
      </div>
      <p className={styles.room__creator}>{room?.players[0].public_name}</p>
      <p className={styles.room__number}><ManIcon width={12} height={12} /> {room.players_count}/2</p>
      <p className={`${styles.room__number} ${styles.room__bet}`}>
        {room.currency === "coins" ? `💵 ${room.bet}` : `🔰 ${room.bet}`}
      </p>
    </div>
  )
};

export default Room;
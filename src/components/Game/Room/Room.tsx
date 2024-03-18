import { FC } from "react";
import styles from './Room.module.scss';
import hand from '../../../images/main_hand_1_tiny.png';
import { useNavigate } from "react-router-dom";

interface IProps {
  room: any;
}

const Room: FC<IProps> = ({ room }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.room} onClick={() => navigate('/4')}>
      <img src={hand} alt="game-logo" className={styles.room__image} />
      <p className={styles.room__text}>{room.gameType}</p>
      <p className={styles.room__text}>{room.creator}</p>
      <p className={styles.room__number}>{room.users}/2</p>
      <p className={styles.room__number}>{room.bet}</p>
    </div>
  )
};

export default Room;
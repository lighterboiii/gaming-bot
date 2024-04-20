import { FC } from "react";
import { useAppSelector } from "../../services/reduxHooks";
import { useNavigate } from "react-router-dom";
import styles from './JoinRoomPopup.module.scss';
import energy from '../../images/energy-drink.png';
import Button from "../ui/Button/Button";
import { joinRoomRequest } from "../../api/gameApi";
import { userId } from "../../api/requestData";

interface IProps {
  setModalOpen: () => void;
  room: any;
}

const JoinRoomPopup: FC<IProps> = ({ setModalOpen, room }) => {
  const navigate = useNavigate();
  const userInfo = useAppSelector(store => store.app.info);

  const handleJoinRoom = () => {
      joinRoomRequest(userId, room.room_id)
        .then((res) => {
          console.log("Присоединение к комнате выполнено успешно:", res);
          navigate(`/room/${room.room_id}`);
        })
        .catch((error) => {
          console.error("Ошибка при присоединении к комнате:", error);
        });
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popup__modalChildren}>
        <p className={styles.popup__modalText}>
          Хотите использовать?
          <img src={energy} alt="drink" className={styles.popup__logoDrink} />
        </p>
        <p className={styles.popup__modalText}>(1/{userInfo?.user_energy_drinks})</p>
      </div>
      <div className={styles.popup__buttons}>
        <div className={styles.popup__modalButtonWrapper}>
          <Button text="Нет" handleClick={() => setModalOpen()} />
        </div>
        <div className={styles.popup__modalButtonWrapper}>
          <Button text="Да" handleClick={() => handleJoinRoom()} />
        </div>
      </div>
    </div>
  )
};

export default JoinRoomPopup;
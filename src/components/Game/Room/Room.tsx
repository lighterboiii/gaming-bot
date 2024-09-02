/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { joinRoomRequest, leaveRoomRequest } from "../../../api/gameApi";
import { userId } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";
import ManIcon from "../../../icons/Man/Man";
import whoCloser from '../../../images/gameSec.png';
import hand from '../../../images/main_hand_1_tiny.png';
import { useAppSelector } from "../../../services/reduxHooks";
import { IGameData } from "../../../utils/types/gameTypes";

import styles from './Room.module.scss';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  room: IGameData | any;
  openModal: () => void;
}

const Room: FC<IProps> = ({ room, openModal }) => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const userId = user?.id;
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const translation = useAppSelector(store => store.app.languageSettings);
  const userInfo = useAppSelector(store => store.app.info);
  const handleJoinRoom = (roomType: number) => {
    if (room.free_places === 0) {
      setIsMessage(true);
      setMessage(translation?.no_free_places || "Нет свободных мест");
      setTimeout(() => {
        setIsMessage(false);
      }, 1500);
      return;
    }

    if ((userInfo?.user_energy === 0 && Number(room?.bet_type) === 3) || roomType === 0) {
      openModal();
      return;
    }

    if (userInfo && room?.bet_type === 3 && (room?.bet > userInfo?.tokens)) {
      setIsMessage(true);
      setMessage(translation?.insufficient_tokens || "Недостаточно средств");
      setTimeout(() => {
        setIsMessage(false);
      }, 1500)
      return;
    } else if (userInfo && room?.bet_type === 1 && (room?.bet > userInfo?.coins)) {
      setIsMessage(true);
      setMessage(translation?.insufficient_coins || "Недостаточно средств");
      setTimeout(() => {
        setIsMessage(false);
      }, 1500)
      return;
    }

    joinRoomRequest(userId, String(room.room_id))
      .then((res) => {
        postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success' });
        navigate(roomType === 1 ? `/room/${room.room_id}` : `/closest/${room.room_id}`);
      })
      .catch((error) => {
        console.error("Error joining room:", error);
        handleLeaveRoom();
      });
  };

  const handleLeaveRoom = () => {
    leaveRoomRequest(userId)
      .then((data) => {
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.room}
      onClick={() => handleJoinRoom(Number(room.room_type))}
      key={room?.room_id}>
      <div className={styles.room__game}>
        <p className={styles.room__gameName}>
          {Number(room?.room_type) === 1 ? `${translation?.rock_paper_scissors}` : `${translation?.closest_number}`}
        </p>
        <img
          src={room?.game_pic}
          alt="game-logo"
          className={styles.room__image}
        />
      </div>
      {isMessage ? (
        <p className={styles.room__creator}>{message}</p>
      ) : (
        <p className={styles.room__creator}>{room?.players[0].public_name}</p>
      )}
      <p className={styles.room__number}>
        <ManIcon width={12}
          height={12} /> {room.players_count}/{room.free_places + room.players_count}
      </p>
      <p className={`${styles.room__number} ${styles.room__bet}`}>
        {Number(room.bet_type) === 1 ? `💵 ${room.bet}` : `🔰 ${room.bet}`}
      </p>
    </div>
  )
};

export default Room;

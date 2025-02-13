/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { getUserId } from "utils/userConfig";

import ManIcon from "../../../icons/Man/Man";
import { useAppSelector } from "../../../services/reduxHooks";
import { WebSocketContext } from '../../../socket/WebSocketContext';
import { MONEY_EMOJI, SHIELD_EMOJI } from "../../../utils/constants";
import { IGameData } from "../../../utils/types/gameTypes";

import styles from './Room.module.scss';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  room: IGameData | any;
  openModal: () => void;
}

const Room: FC<IProps> = ({ room, openModal }) => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const translation = useAppSelector(store => store.app.languageSettings);
  const userInfo = useAppSelector(store => store.app.info);
  const { sendMessage, wsMessages, connect, clearMessages } = useContext(WebSocketContext)!;

  // useEffect(() => {
  //   const lastMessage = wsMessages[wsMessages.length - 1];
  //   if (lastMessage) {
  //     const parsedMessage = JSON.parse(lastMessage);
  //   }
  // }, [wsMessages]);

  const handleJoinRoom = async (roomType: number) => {
    if (room.free_places === 0) {
      setIsMessage(true);
      setMessage(translation?.no_free_places || "Нет свободных мест");
      setTimeout(() => {
        setIsMessage(false);
      }, 1500);
      return;
    }

    if (room.players[0].userid === userId) {
      setIsMessage(true);
      setMessage("Server error");
      clearMessages();
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

    try {
      clearMessages();
      if (!wsMessages || wsMessages.length === 0) {
        connect();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      sendMessage({
        user_id: userId,
        room_id: room.room_id,
        type: 'addplayer'
      });

      const timeout = setTimeout(() => {
        navigate(room?.room_type === 1 
          ? `/room/${room?.room_id}` 
          : room?.room_type === 2 
            ? `/closest/${room?.room_id}`
            : `/ludkaGame/${room?.room_id}`);
      }, 1000);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className={styles.room}
      onClick={() => handleJoinRoom(Number(room.room_type))}
      key={room?.room_id}>
      <div className={styles.room__game}>
        <p className={styles.room__gameName}>
          {Number(room?.room_type) === 1 
            ? `${translation?.rock_paper_scissors}` 
            : Number(room?.room_type) === 2 
              ? `${translation?.closest_number}`
              : `${translation?.ludka_name}`}
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
        {Number(room.bet_type) === 1 ? `${MONEY_EMOJI} ${room.bet}` : `${SHIELD_EMOJI} ${room.bet}`}
      </p>
    </div>
  )
};

export default Room;
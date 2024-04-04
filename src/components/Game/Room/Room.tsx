/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './Room.module.scss';
import hand from '../../../images/main_hand_1_tiny.png';
import whoCloser from '../../../images/gameSec.png';
import { useNavigate } from "react-router-dom";
import ManIcon from "../../../icons/Man/Man";
import { useAppDispatch, useAppSelector } from "../../../services/reduxHooks";
import useTelegram from "../../../hooks/useTelegram";
import { joinRoomRequest } from "../../../api/gameApi";
import { userId } from "../../../api/requestData";
import useWebSocketService from "../../../services/webSocketService";
import { setSocket } from "../../../services/wsSlice";
// типизировать
interface IProps {
  room: any;
}

const Room: FC<IProps> = ({ room }) => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const dispatch = useAppDispatch();
  const userId = user?.id;
  const translation = useAppSelector(store => store.app.languageSettings);
  // const webSocketService = useWebSocketService<any>(`wss://gamebottggw.ngrok.app/room`);
  // useEffect(() => {
  //   webSocketService.setMessageHandler((message) => {
  //     console.log('Получено сообщение:', message);
  //     dispatch(setSocket(message?.room_data));
  //     navigate(`/room/${message.room_id}`);
  //   });
  // }, [webSocketService]);
  
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
  // const handleJoinRoom = (roomId: any) => {
  //   const data = {
  //     user_id: userId,
  //     room_id: room.room_id
  //   };
  //   const joinRoomMessage = {
  //     type: 'addplayer',
  //     ...data
  //   };
  //   webSocketService.sendMessage(joinRoomMessage);
  // };
  
  return (
    <div className={styles.room} onClick={handleJoinRoom} key={room?.id}>
      <div className={styles.room__game}>
        <p className={styles.room__gameName}>
          {room?.room_type === 1 ? `${translation?.rock_paper_scissors}` : `${translation?.closest_number}`}
        </p>
        <img src={room?.room_type === 1 ? hand : whoCloser} alt="game-logo" className={styles.room__image} />
      </div>
      <p className={styles.room__creator}>{room?.players[0].public_name}</p>
      <p className={styles.room__number}><ManIcon width={12} height={12} /> {room.players_count}/{room.free_places + room.players_count}</p>
      <p className={`${styles.room__number} ${styles.room__bet}`}>
        {room.bet_type === 1 ? `💵 ${room.bet}` : `🔰 ${room.bet}`}
      </p>
    </div>
  )
};

export default Room;
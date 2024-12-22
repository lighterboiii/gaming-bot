/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Warning } from '../../components/OrientationWarning/Warning';
import useOrientation from '../../hooks/useOrientation';
import { useAppSelector } from '../../services/reduxHooks';
import { WebSocketContext } from '../../socket/WebSocketContext';
import { getUserId } from '../../utils/userConfig';

import styles from './Monetka.module.scss';

export const Monetka: FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userId = getUserId();
  const isPortrait = useOrientation();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const translation = useAppSelector(store => store.app.languageSettings);
  const { sendMessage, wsMessages, connect } = useContext(WebSocketContext)!;
  const parsedMessages = wsMessages?.map(msg => JSON.parse(msg));

  useEffect(() => {
    if (!wsMessages || wsMessages.length === 0) {
      connect();
    }
  }, [connect, wsMessages]);

  useEffect(() => {
    const data = {
      type: 'join_room',
      user_id: userId,
      room_id: roomId
    };
    sendMessage(data);
  }, [roomId, sendMessage, userId]);

  if (!isPortrait) {
    return <Warning />;
  }

  return (
    <div className={styles.monetka}>
      <h1>Монетка</h1>
      <p>Здесь будет основной контент игры</p>
    </div>
  );
};

export default Monetka; 
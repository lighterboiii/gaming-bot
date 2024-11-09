/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { userId } from "api/requestData";
import useOrientation from "hooks/useOrientation";
import useTelegram from "hooks/useTelegram";
import { useAppDispatch, useAppSelector } from "services/reduxHooks";
import { WebSocketContext } from "socket/WebSocketContext";
import { tokenCurr } from "utils/constants";

import UserAvatar from "../../components/User/UserAvatar/UserAvatar";

import styles from "./BetGame.module.scss";

const BetGame: FC = () => {
  // const { tg, user } = useTelegram();
  // const userId = user?.id;
  const { roomId } = useParams<{ roomId: string }>();
  const { wsMessages, sendMessage, disconnect, clearMessages } = useContext(WebSocketContext)!;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(store => store.app.info);
  const isPortrait = useOrientation();
  const [data, setData] = useState<any>(null);
  // tg setter
  // useEffect(() => {
  //   tg.setHeaderColor('#1b50b8');
  //   tg.BackButton.show();
  //   tg.BackButton.onClick(() => {
  //     sendMessage({
  //       user_id: userId,
  //       room_id: roomId,
  //       type: 'kickplayer'
  //     });
  //   });
  //   return () => {
  //     tg.BackButton.hide();
  //     tg.setHeaderColor('#d51845');
  //   }
  // }, [tg, navigate, userId]);

// initial data fetching methid
  // useEffect(() => {
  //   setLoading(true);

  //   if (!roomId) {
  //     setLoading(false);
  //     return;
  //   }
  //   const fetchInitialData = () => {
  //     sendMessage({
  //       user_id: userId,
  //       room_id: roomId,
  //       type: 'room_info'
  //     });
  //   };

  //   fetchInitialData();
  // }, []);
// ws message useEffect
  // useEffect(() => {
  //   const messageHandler = (message: any) => {
  //     const res = JSON.parse(message);
  //     switch (res?.type) {
  //       case 'room_info':
  //         setData(res);
  //         setLoading(false);
  //         break;
  //       case 'one':
  //         break;
  //       case 'two':
  //         setData(res);
  //         break;
  //       case 'emoji':
  //         setData(res);
  //         break;
  //       case 'kickplayer':
  //         if (res?.player_id === userId) {
  //           navigate(indexUrl);
  //           clearMessages();
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //   };
  //   const handleMessage = () => {
  //     wsMessages.forEach((message: any) => {
  //       messageHandler(message);
  //     });
  //   };
  //   handleMessage();
  // }, [wsMessages]);

  return (
    <div className={styles.game}>
      <div className={styles.game__mainContainer}>
        <h2 className={styles.game__currentBetHeading}>Текущая ставка:</h2>
        <p className={styles.game__currentBet}>
          <span>{tokenCurr}</span>
          <span>25.7</span>
        </p>
        <div className={styles.game__userContainer}>
          <div className={styles.game__useNameContainer}>
            <p>Юзер:</p>
            <p>UserName</p>
          </div>
          <UserAvatar />
        </div>
        <p>Общий банк: 52,7</p>
      </div>
      <div className={styles.game__balanceContainer}>
        <p>Баланс:</p>
        <p>28765</p>
      </div>
      <div className={styles.game__buttonContainer}>
        <div className={styles.game__betContainer}>
          <p>Ставка:</p>
          <p>25</p>
        </div>
        <button className={styles.game__mainButton} onClick={() => {}}>
          Поднять <br></br> ставку
        </button>
      </div>
    </div>
  )
};

export default BetGame;
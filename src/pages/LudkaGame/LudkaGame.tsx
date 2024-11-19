/* eslint-disable react-hooks/exhaustive-deps */
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
import { formatNumber } from "utils/additionalFunctions";

import { Warning } from "../../components/OrientationWarning/Warning";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import { tokenCurr } from "../../utils/constants";
import { indexUrl } from "../../utils/routes";

import styles from "./LudkaGame.module.scss";

const LudkaGame: FC = () => {
  const { tg, user } = useTelegram();
  const [loading, setLoading] = useState<boolean>(false);
  // const userId = user?.id;
  const { roomId } = useParams<{ roomId: string }>();
  const { wsMessages, sendMessage, disconnect, clearMessages } = useContext(WebSocketContext)!;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(store => store.app.info);
  const isPortrait = useOrientation();
  const [data, setData] = useState<any>(null);
  console.log(data)
  // tg setter
  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      sendMessage({
        user_id: userId,
        room_id: roomId,
        type: 'kickplayer'
      });
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
    }
  }, [tg, navigate, userId]);
  
  useEffect(() => {
    setLoading(true);

    if (!roomId) {
      setLoading(false);
      return;
    }
    const fetchInitialData = () => {
      sendMessage({
        user_id: userId,
        room_id: roomId,
        type: 'room_info'
      });
    };

    fetchInitialData();
  }, []);
// ws message useEffect
  useEffect(() => {
    const messageHandler = (message: any) => {
      const res = JSON.parse(message);
      switch (res?.type) {
        case 'choice':
          setData(res);
          clearMessages();
          setLoading(false);
          break;
        case 'whoiswin':
          console.log(res);
          break;
        case 'error':
          console.log(res);
          break;
        case 'emoji':
          setData(res);
          break;
        case 'kickplayer':
          if (res?.player_id === userId) {
            navigate(indexUrl);
            clearMessages();
          }
          break;
        default:
          break;
      }
    };
    const handleMessage = () => {
      if (wsMessages.length > 0) {
        wsMessages.forEach((message: any) => {
          messageHandler(message);
        });
      }
    };
    handleMessage();
  }, [wsMessages]);
  console.log(userData);
  const handleChoice = (choice: string) => {
    sendMessage({
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: choice
    });
  };

  if (!isPortrait) {
    return (
      <Warning />
    );
  }

  return (
    <div className={styles.game}>
      <div className={styles.game__mainContainer}>
        <h2 className={styles.game__currentBetHeading}>Текущая ставка:</h2>
        <p className={styles.game__currentBet}>
          <span>{tokenCurr}</span>
          <span>{data?.bet}</span>
        </p>
        <div className={styles.game__userContainer}>
          <div className={styles.game__useNameContainer}>
            <p>Юзер:</p>
            <p>UserName</p>
          </div>
          <div className={styles.game__avatarContainer}>
            <UserAvatar />
          </div>
        </div>
        <p>Общий банк: 52,7</p>
      </div>
      <div className={styles.players__balanceContainer}>
            {data?.bet_type === "1" && userData
              ? <span>💵 {formatNumber(userData?.coins ?? 0)}</span>
              : <span>🔰 {formatNumber(userData?.tokens ?? 0)}</span>
            }
          </div>
      <div className={styles.game__buttonContainer}>
        <div className={styles.game__betContainer}>
          <p>Ставка:</p>
          <p>25</p>
        </div>
        <button className={styles.game__mainButton} onClick={() => handleChoice('9.1')}>
          Поднять <br></br> ставку
        </button>
      </div>
    </div>
  )
};

export default LudkaGame;
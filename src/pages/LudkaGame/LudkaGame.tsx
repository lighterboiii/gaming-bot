/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useOrientation from "hooks/useOrientation";
import useTelegram from "hooks/useTelegram";
import { useAppDispatch, useAppSelector } from "services/reduxHooks";
import { WebSocketContext } from "socket/WebSocketContext";
import { formatNumber } from "utils/additionalFunctions";

import { Warning } from "../../components/OrientationWarning/Warning";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import coinIcon from '../../images/coinIcon.png';
import { tokenCurr } from "../../utils/constants";
import { indexUrl } from "../../utils/routes";
import { getUserId } from "../../utils/userConfig";

import styles from "./LudkaGame.module.scss";

const LudkaGame: FC = () => {
  const { tg } = useTelegram();
  const [loading, setLoading] = useState<boolean>(false);
  const userId = getUserId();
  const { roomId } = useParams<{ roomId: string }>();
  const { wsMessages, sendMessage, disconnect, clearMessages } = useContext(WebSocketContext)!;
  // const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const userData = useAppSelector(store => store.app.info);
  const isPortrait = useOrientation();
  const [data, setData] = useState<any>(null);
  console.log(data)
  console.log(userData);
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
        case 'room_info':
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
      <p className={styles.game__roomCounter}>
        {data?.room_counter}
      </p>
      <div className={styles.game__content}>
        <div className={styles.game__mainContainer}>
          <div className={styles.game__userContainer}>
            <div className={styles.game__avatarContainer}>
              <UserAvatar />
            </div>
            <div className={styles.game__userNameContainer}>
              <p className={styles.game__userName}>
                {userData && userData?.publicname}
              </p>
              <p className={styles.game__money}>
                +
                <img src={coinIcon} alt="coin" className={styles.game__moneyIcon} />
                {data?.bet_type === "1"
                  ? `${userData?.coins && formatNumber(userData?.coins)}`
                  : ` ${userData?.tokens && formatNumber(userData?.tokens)}`}
              </p>
            </div>
          </div>
          <div className={styles.game__infoContainer}>
            <div className={styles.game__betContainer}>
              <p className={styles.game__text}>Текущая ставка:</p>
              <p className={styles.game__bet}>
                <img src={coinIcon} alt="coin" className={styles.game__moneyBetIcon} />
                25.7
              </p>
            </div>
            <div className={styles.game__infoInnerContainer}>
              <div className={styles.game__info}>
                <p className={styles.game__text}>Баланс:</p>
                <p className={styles.game__money}>
                  <img src={coinIcon} alt="coin" className={styles.game__moneyIcon} />
                  100
                </p>
              </div>
              <div className={styles.game__info}>
                <p className={styles.game__text}>Баланс:</p>
                <p className={styles.game__money}>
                  <img src={coinIcon} alt="coin" className={styles.game__moneyIcon} />
                  100
                </p>
              </div>
            </div>
          </div>
          <div className={styles.game__buttonsContainer}>
            <button className={styles.game__actionButton}>
              <p className={styles.game__actionButtonText}>Поднять ставку</p>
            </button>
            <button className={styles.game__logButton}>
              b
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default LudkaGame;
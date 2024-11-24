/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useOrientation from "hooks/useOrientation";
import useTelegram from "hooks/useTelegram";
import LogIcon from "icons/LogButtonIcon/LogIcon";
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
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  console.log(data)
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
  
  const handleOpenOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
    setInputValue('');
  };

  const handleCloseOverlay = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowOverlay(false);
      setInputValue('');
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        handleCloseOverlay();
      }
    };

    if (showOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOverlay]);

  const handleKeyPress = (key: number) => {
    setInputValue(prev => prev + key.toString());
  };

  const handleDelete = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (inputValue) {
      handleChoice(inputValue);
    }
  };

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

  const handleChoice = (choice: string) => {
    sendMessage({
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: choice
    });
    handleCloseOverlay();
  };

  if (!isPortrait) {
    return (
      <Warning />
    );
  }
  console.log(userData);
  return (
    <div className={styles.game}>
      <div className={styles.game__content}>
        <div className={styles.game__mainContainer}>
          <div className={styles.game__userContainer}>
            <div className={styles.game__avatarContainer}>
              <UserAvatar />
            </div>
            <div className={styles.game__userNameContainer}>
              <p className={styles.game__userName}>
                {userData?.publicname}
              </p>
              <p className={styles.game__money}>
                +
                <img src={coinIcon} alt="монета" className={styles.game__moneyIcon} />
                <span>25</span>
              </p>
            </div>
          </div>

          <div className={styles.game__infoContainer}>
            <div className={styles.game__betContainer}>
              <p className={styles.game__text}>Текущая ставка:</p>
              <p className={styles.game__bet}>
                <img src={coinIcon} alt="монета" className={styles.game__moneyBetIcon} />
                <span>{data?.bet}</span>
              </p>
            </div>

            <div className={styles.game__infoInnerContainer}>
              <div className={styles.game__info}>
                <p className={styles.game__text}>Баланс:</p>
                <p className={styles.game__money}>
                  <img src={coinIcon} alt="монета" className={styles.game__moneyIcon} />
                  <span>
                    {data?.bet_type === "1"
                      ? userData?.coins && formatNumber(userData?.coins)
                      : userData?.tokens && formatNumber(userData?.tokens)
                    }
                  </span>
                </p>
              </div>

              <button
                className={styles.game__keysButton}
                onClick={handleOpenOverlay}
              >
                <p className={styles.game__text}>Поднять на:</p>
                <p className={styles.game__money}>
                  <img src={coinIcon} alt="монета" className={styles.game__moneyIcon} />
                  <span>100</span>
                </p>
              </button>
            </div>
          </div>

          <div className={styles.game__buttonsContainer}>
            <button className={styles.game__actionButton}>
              <span className={styles.game__actionButtonText}>Поднять ставку</span>
            </button>
            <button className={styles.game__logButton}>
              <LogIcon width={40} height={40} />
            </button>
          </div>
        </div>
      </div>

      {showOverlay && (
        <div 
          ref={overlayRef}
          className={`${styles.overlay} ${isVisible ? styles.expanded : ''}`}
        >
          <div className={styles.overlay__inputContainer}>
            <p className={styles.overlay__inputLabel}>
              Введите сумму ставки
            </p>
            <input
              type="text"
              className={styles.overlay__input}
              value={inputValue}
              placeholder="0"
              readOnly
            />
          </div>

          <div className={styles.overlay__keyboard}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Удалить', 0, 'Готово'].map((key) => (
              <button
                key={key}
                className={typeof key === 'number' ? 
                  styles.overlay__key : 
                  key === 'Удалить' ? styles.overlay__bottomLeftButton : styles.overlay__bottomRightButton
                }
                onClick={() => {
                  if (typeof key === 'number') handleKeyPress(key);
                  else if (key === 'Удалить') handleDelete();
                  else handleSubmit();
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
};

export default LudkaGame;
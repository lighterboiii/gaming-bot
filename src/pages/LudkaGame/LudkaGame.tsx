/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LogOverlay } from "components/LudkaGame/LogOverlay/LogOverlay";

import { Overlay } from "../../components/LudkaGame/Overlay/LudkaOverlay";
import { Warning } from "../../components/OrientationWarning/Warning";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useOrientation from "../../hooks/useOrientation";
import useTelegram from "../../hooks/useTelegram";
import LogIcon from "../../icons/LogButtonIcon/LogIcon";
import coinIcon from '../../images/coinIcon.png';
import { setCoinsNewValue, setNewTokensValue } from "../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { WebSocketContext } from "../../socket/WebSocketContext";
import { formatNumber } from "../../utils/additionalFunctions";
import { indexUrl } from "../../utils/routes";
import { getUserId } from "../../utils/userConfig";

import styles from "./LudkaGame.module.scss";

const LudkaGame: FC = () => {
  const { tg } = useTelegram();
  const [loading, setLoading] = useState<boolean>(false);
  const userId = getUserId();
  const { roomId } = useParams<{ roomId: string }>();
  const { wsMessages, sendMessage, clearMessages } = useContext(WebSocketContext)!;
  const navigate = useNavigate();
  const userData = useAppSelector(store => store.app.info);
  const isPortrait = useOrientation();
  const [data, setData] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [showLogOverlay, setShowLogOverlay] = useState(false);
  const [isLogVisible, setIsLogVisible] = useState(false);
  const logOverlayRef = useRef<HTMLDivElement>(null);

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
          const currentBalance = data?.bet_type === "1" ? userData?.coins ?? 0 : userData?.tokens ?? 0;
          const choiceValue = parseFloat(res.choice);
          const newBalance = currentBalance - choiceValue;
          
          if (data?.bet_type === "1") {
            dispatch(setCoinsNewValue(newBalance));
          } else {
            dispatch(setNewTokensValue(newBalance));
          }
          
          clearMessages();
          setLoading(false);
          break;
        case 'whoiswin':
          console.log(res);
          break;
        case 'error':
          console.log(res);
          setData(res?.room_info);
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

  const calculateNextBet = () => {
    return data?.bet ? (Number(data.bet) + 0.5).toString() : '0';
  };

  const handleOpenOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
    setInputValue(calculateNextBet());
    setInputError(false);
  };

  const handleCloseOverlay = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowOverlay(false);
      setInputValue('');
    }, 300);
  };

  const handleOpenLog = () => {
    setShowLogOverlay(true);
    setTimeout(() => {
      setIsLogVisible(true);
    }, 50);
  };

  const handleCloseLog = () => {
    setIsLogVisible(false);
    setTimeout(() => {
      setShowLogOverlay(false);
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
    setInputValue(prev => {
      const newValue = prev + key.toString();
      const [wholePart, decimalPart] = newValue.split('.');

      if (newValue.length > 1 && wholePart.startsWith('0') && !newValue.startsWith('0.')) {
        setInputError(true);
      } else if (decimalPart && decimalPart.length > 2) {
        setInputError(true);
        return prev;
      } else {
        const numValue = parseFloat(newValue);
        if (numValue >= 0) {
          setInputError(false);
        } else {
          setInputError(true);
        }
      }
      return newValue;
    });
  };

  const handleDelete = () => {
    setInputValue(prev => {
      const newValue = prev.slice(0, -1);
      const numValue = parseInt(newValue, 10);

      if (newValue.startsWith('0')) {
        setInputError(true);
      } else if (newValue === '' || (numValue >= 1)) {
        setInputError(false);
      } else {
        setInputError(true);
      }
      return newValue;
    });
  };

  const handleSubmit = () => {
    const numValue = parseFloat(inputValue);
    if (numValue >= 0) {
      handleChoice(inputValue);
    } else {
      setInputError(true);
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

  const handleDecimalPoint = () => {
    setInputValue(prev => {
      if (prev.includes('.')) return prev;
      if (prev === '') return '0.';
      return prev + '.';
    });
  };

  const handleRaiseBet = () => {
    const nextBet = calculateNextBet();
    handleChoice(nextBet);
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
        <div className={styles.game__head}>
          <p className={styles.game__text}>Общий банк:</p>
          <p>{data?.win?.winner_value}</p>
        </div>
        <div className={styles.game__mainContainer}>
          <div className={styles.game__userContainer}>
            <div className={styles.game__avatarContainer}>
              {data?.win?.users === "none" ? <UserAvatar /> : "другой юзер"}
            </div>
            <div className={styles.game__userNameContainer}>
              <p className={styles.game__userName}>
                {userData?.publicname}
              </p>
              <p className={styles.game__money}>
                +
                <img src={coinIcon} alt="money" className={styles.game__moneyIcon} />
                <span>{data?.win?.users === "none" ? 0 : data?.win?.users}</span>
              </p>
            </div>
          </div>

          <div className={styles.game__infoContainer}>
            <div className={styles.game__betContainer}>
              <p className={styles.game__text}>Текущая ставка:</p>
              <p className={styles.game__bet}>
                <img src={coinIcon} alt="money" className={styles.game__moneyBetIcon} />
                <span>{data?.bet}</span>
              </p>
            </div>

            <div className={styles.game__infoInnerContainer}>
              <div className={styles.game__info}>
                <p className={styles.game__text}>Баланс:</p>
                <p className={styles.game__money}>
                  <img src={coinIcon} alt="money" className={styles.game__moneyIcon} />
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
                  <span>{calculateNextBet()}</span>
                </p>
              </button>
            </div>
          </div>

          <div className={styles.game__buttonsContainer}>
            <button 
              className={styles.game__actionButton}
              onClick={handleRaiseBet}
            >
              <span className={styles.game__actionButtonText}>Поднять ставку</span>
            </button>
            <button 
              className={styles.game__logButton}
              onClick={handleOpenLog}
            >
              <LogIcon width={40} height={40} />
            </button>
          </div>
        </div>
      </div>

      {showOverlay && (
        <Overlay
          isVisible={isVisible}
          inputValue={inputValue}
          inputError={inputError}
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onDecimalPoint={handleDecimalPoint}
          onSubmit={handleSubmit}
          overlayRef={overlayRef}
        />
      )}

      {showLogOverlay && (
        <LogOverlay
          isVisible={isLogVisible}
          onClose={handleCloseLog}
          overlayRef={logOverlayRef}
          users={data?.win?.users}
        />
      )}
    </div>
  )
};

export default LudkaGame;
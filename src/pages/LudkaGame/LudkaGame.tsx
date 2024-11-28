/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LogOverlay } from "components/LudkaGame/LogOverlay/LogOverlay";

import Loader from "../../components/Loader/Loader";
import { Overlay } from "../../components/LudkaGame/Overlay/LudkaOverlay";
import { Warning } from "../../components/OrientationWarning/Warning";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useOrientation from "../../hooks/useOrientation";
import useTelegram from "../../hooks/useTelegram";
import LogIcon from "../../icons/LogButtonIcon/LogIcon";
import coinIcon from '../../images/mount/coinIcon.png';
import { setCoinsValueAfterBuy, setTokensValueAfterBuy } from "../../services/appSlice";
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
  const [winner, setWinner] = useState<{
    item: {
      item_pic: string;
      item_mask: string;
    },
    user_name: string;
    winner_value: string;
  } | null>(null);

  useEffect(() => {
    tg.setHeaderColor('#4caf50');
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

  useEffect(() => {
    const messageHandler = (message: any) => {
      const res = JSON.parse(message);
      switch (res?.type) {
        case 'choice':
          setData(res);
          clearMessages();
          break;
        case 'whoiswin':
          console.log(res);
          setWinner({
            item: {
              item_pic: res.whoiswin.item_pic,
              item_mask: res.whoiswin.item_mask
            },
            user_name: res.whoiswin.user_name,
            winner_value: res.whoiswin.winner_value
          });
          setTimeout(() => {
            setWinner(null);
            setData((prevData: any) => ({
              ...prevData,
              bet: res?.bet || "0",
              win: {
                ...prevData.win,
                users: "none",
                winner_value: "0"
              }
            }));
          }, 6000);
          break;
        case 'error':
          console.log(res);
          setData(res?.room_info);
          break;
        case 'emoji':
          setData(res);
          break;
        case 'room_info':
          setLoading(false);
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
    return data?.bet ? (Number(formatNumber(Number(data.bet))) + 0.5).toString() : '0';
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

  const handleChoice = (choice: string) => {
    const choiceValue = Number(choice || 0);

    if (data?.bet_type === "1") {
      dispatch(setCoinsValueAfterBuy(choiceValue));
    } else {
      dispatch(setTokensValueAfterBuy(choiceValue));
    }

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
  console.log(winner);
  if (!isPortrait) {
    return (
      <Warning />
    );
  }
  console.log(userData);
  return (
    <div className={styles.game}>
      <div className={`${styles.game__content} ${winner ? styles.game__content_winner : ''}`}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className={styles.game__head}>
              <div className={styles.game__headInner}>
                <p className={styles.game__text}>Общий банк:</p>
                <p>{data?.win?.winner_value !== "none" ? formatNumber(Number(data?.win?.winner_value)) : '0'}</p>
              </div>
            </div>
            <div className={styles.game__mainContainer}>
              <div className={`${styles.game__userContainer} ${winner ? styles.game__userContainer_winner : ''}`}>
                <div className={styles.game__avatarContainer}>
                  {winner
                    ? <UserAvatar item={winner?.item} />
                    : data?.win?.users === "none"
                      ? <UserAvatar />
                      : <UserAvatar item={data?.win?.users[data.win.users.length - 1]} />
                  }
                </div>
                <div className={styles.game__userNameContainer}>
                  <p className={styles.game__userName}>
                    {winner
                      ? `Победитель: ${winner.user_name}`
                      : data?.win?.users === "none"
                        ? userData?.publicname
                        : data?.win?.users[data.win.users.length - 1]?.user_name
                    }
                  </p>
                  <p className={styles.game__money}>
                    +
                    <img src={coinIcon} alt="money" className={styles.game__moneyIcon} />
                    <span>
                      {winner
                        ? formatNumber(Number(winner.winner_value))
                        : data?.win?.users === "none"
                          ? formatNumber(Number(data?.bet || 0))
                          : formatNumber(Number(data?.win?.users[data.win.users.length - 1]?.coins || 0))
                      }
                    </span>
                  </p>
                </div>
              </div>

              <div className={styles.game__infoContainer}>
                <div className={styles.game__betContainer}>
                  <p className={styles.game__text}>Текущая ставка:</p>
                  <p className={styles.game__bet}>
                    <img src={coinIcon} alt="money" className={styles.game__moneyBetIcon} />
                    <span>{formatNumber(Number(data?.bet))}</span>
                  </p>
                </div>

                <div className={styles.game__infoInnerContainer}>
                  <div className={styles.game__info}>
                    <p className={styles.game__text}>Баланс:</p>
                    <p className={styles.game__money}>
                      <img src={coinIcon} alt="money" className={styles.game__moneyIcon} />
                      <span>
                        {data?.bet_type === "1"
                          ? userData?.coins && `${formatNumber(Number(userData?.coins))}`
                          : userData?.tokens && `${formatNumber(Number(userData?.tokens))}`
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
                      <img src={coinIcon} alt="money" className={styles.game__moneyIcon} />
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
          </>
        )}
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
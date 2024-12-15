/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";
import Loader from "../../components/Loader/Loader";
import { LogOverlay } from "../../components/LudkaGame/LogOverlay/LogOverlay";
import { Overlay } from "../../components/LudkaGame/Overlay/LudkaOverlay";
import { Warning } from "../../components/OrientationWarning/Warning";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import useOrientation from "../../hooks/useOrientation";
import useTelegram from "../../hooks/useTelegram";
import LogIcon from "../../icons/LogButtonIcon/LogIcon";
import RoomCounterIcon from "../../icons/RoomCounter/RoomCounter";
import coins from '../../images/mount/coins.png';
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import { useAppSelector } from "../../services/reduxHooks";
import { WebSocketContext } from "../../socket/WebSocketContext";
import { formatNumber } from "../../utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "../../utils/constants";
import { indexUrl } from "../../utils/routes";
import { ILudkaGameState, ILudkaOverlayState, ILudkaLogState } from "../../utils/types/gameTypes";
import { getUserId } from "../../utils/userConfig";

import styles from "./LudkaGame.module.scss";

const LudkaGame: FC = () => {
  const { tg } = useTelegram();
  const [gameState, setGameState] = useState<ILudkaGameState>({
    data: null,
    winner: null,
    loading: false
  });
  const userId = getUserId();
  const { roomId } = useParams<{ roomId: string }>();
  const { wsMessages, sendMessage, clearMessages, disconnect } = useContext(WebSocketContext)!;
  const navigate = useNavigate();
  const userData = useAppSelector(store => store.app.info);
  const isPortrait = useOrientation();
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [showCoinsAnimation, setShowCoinsAnimation] = useState(false);
  const [overlayState, setOverlayState] = useState<ILudkaOverlayState>({
    show: false,
    isVisible: false,
    inputValue: '',
    inputError: false
  });
  const [logState, setLogState] = useState<ILudkaLogState>({
    show: false,
    isVisible: false,
    resetHistory: false
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const logOverlayRef = useRef<HTMLDivElement>(null);
  const [pendingBet, setPendingBet] = useState<string>('');
  const translation = useAppSelector(store => store.app.languageSettings);
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getRandomPosition = () => {
    const top = Math.random() * 60 + 10;
    const left = Math.random() * 60 + 20;
    return { top: `${top}%`, left: `${left}%` };
  };

  useEffect(() => {
    tg.setHeaderColor('#4caf50');
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      sendMessage({
        user_id: userId,
        room_id: roomId,
        type: 'kickplayer'
      });

      setTimeout(() => {
        clearMessages();
        disconnect();
        navigate(indexUrl, { replace: true });
      }, 500);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');

      setTimeout(() => {
        clearMessages();
        setGameState(prev => ({ ...prev, data: null, winner: null }));
      }, 500);
    }
  }, [tg, navigate, userId]);

  useEffect(() => {
    setGameState(prev => ({ ...prev, loading: true }));

    if (!roomId) {
      setGameState(prev => ({ ...prev, loading: false }));
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
      handleWebSocketMessage(message);
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
    return gameState.data?.bet ? (Number(formatNumber(Number(gameState.data.bet))) + 0.5).toString() : '0';
  };

  const handleOpenOverlay = () => {
    setOverlayState(prev => ({ ...prev, show: true }));
    setTimeout(() => {
      setOverlayState(prev => ({ ...prev, isVisible: true }));
    }, 50);
    setOverlayState(prev => ({ ...prev, inputValue: '' }));
    setOverlayState(prev => ({ ...prev, inputError: false }));
  };

  const handleCloseOverlay = () => {
    setOverlayState(prev => ({ ...prev, isVisible: false }));
    setTimeout(() => {
      setOverlayState(prev => ({ ...prev, show: false }));
      setOverlayState(prev => ({ ...prev, inputValue: '' }));
    }, 300);
  };

  const handleOpenLog = () => {
    setLogState(prev => ({ ...prev, show: true }));
    setTimeout(() => {
      setLogState(prev => ({ ...prev, isVisible: true }));
    }, 50);
  };

  const handleCloseLog = () => {
    setLogState(prev => ({ ...prev, isVisible: false }));
    setTimeout(() => {
      setLogState(prev => ({ ...prev, show: false }));
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        handleCloseOverlay();
      }
    };

    if (overlayState.show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [overlayState.show]);

  const handleKeyPress = (key: number) => {
    setOverlayState(prev => ({ ...prev, inputValue: prev.inputValue + key.toString() }));
    const newValue = overlayState.inputValue + key.toString();
    const [wholePart, decimalPart] = newValue.split('.');

    if (newValue.length > 1 && wholePart.startsWith('0') && !newValue.startsWith('0.')) {
      setOverlayState(prev => ({ ...prev, inputError: true }));
    } else if (decimalPart && decimalPart.length > 2) {
      setOverlayState(prev => ({ ...prev, inputError: true }));
      return;
    } else {
      const numValue = parseFloat(newValue);
      if (numValue >= 0) {
        setOverlayState(prev => ({ ...prev, inputError: false }));
      } else {
        setOverlayState(prev => ({ ...prev, inputError: true }));
      }
    }
  };

  const handleDelete = () => {
    setOverlayState(prev => ({ ...prev, inputValue: prev.inputValue.slice(0, -1) }));
  };

  const handleSubmit = () => {
    const numValue = parseFloat(overlayState.inputValue);
    if (numValue >= 0) {
      setPendingBet(overlayState.inputValue);
      handleCloseOverlay();
    } else {
      setOverlayState(prev => ({ ...prev, inputError: true }));
    }
  };

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
    setOverlayState(prev => ({
      ...prev, inputValue: prev.inputValue.includes('.') ? prev.inputValue : prev.inputValue + '.'
    }));
  };

  const handleRaiseBet = useCallback(() => {
    const betToSend = pendingBet || calculateNextBet();
    handleChoice(betToSend);
    setPendingBet('');
  }, [pendingBet, handleChoice, calculateNextBet]);

  const handleWebSocketMessage = useCallback((message: string) => {
    const res = JSON.parse(message);

    switch (res?.type) {
      case 'choice':
        setShowCoinsAnimation(true);
        setTimeout(() => setShowCoinsAnimation(false), 1000);
        handleChoiceMessage(res);
        break;
      case 'whoiswin':
        handleWinnerMessage(res);
        break;
      case 'error':
        if (Number(res?.user_id) === Number(userId)) {
          if (res?.error === 'small_bet') {
            setErrorMessage(translation?.ludka_small_bet_error || 'Bet is too small');
            setTimeout(() => setErrorMessage(''), 2000);
          }
          if (res?.error === 'bad_bet') {
            setErrorMessage(translation?.ludka_bad_bet_error || 'Already bet');
            setTimeout(() => setErrorMessage(''), 2000);
          }
        }
        
        if (res?.room_info) {
          setGameState(prev => ({ 
            ...prev,
            data: res?.room_info,
            winner: null
          }));
        }
        break;
      case 'emoji':
        setGameState(prev => ({ 
          ...prev, 
          data: res,
          winner: null
        }));
        break;
      case 'room_info':
        setGameState(prev => ({ 
          ...prev, 
          loading: false, 
          data: res,
          winner: null
        }));
        break;
      case 'kickplayer':
        if (Number(res?.player_id) === Number(userId)) {
          clearMessages();
          disconnect();
          navigate(indexUrl, { replace: true });
        }
        break;
      default:
        break;
    }
  }, []);

  const handleChoiceMessage = useCallback((res: any) => {
    setGameState(prev => ({
      ...prev,
      winner: null,
      data: res
    }));
    setSlideDirection(prev => prev === 'right' ? 'left' : 'right');
    clearMessages();
  }, [clearMessages]);

  const handleWinnerMessage = useCallback((res: any) => {
    console.log(res);
    const winner = {
      item: {
        item_pic: res?.whoiswin?.item_pic,
        item_mask: res?.whoiswin?.item_mask
      },
      user_name: res?.whoiswin?.user_name,
      user_pic: res?.whoiswin?.user_pic,
      winner_value: res?.whoiswin?.winner_value
    };

    setGameState(prev => ({ ...prev, winner }));
    setLogState(prev => ({ ...prev, resetHistory: true }));
    setPendingBet('');

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        winner: null
      }));
      setLogState(prev => ({ ...prev, resetHistory: false }));
    }, 6000);
  }, []);

  const currentPlayerBalance = useMemo(() => {
    const currentPlayer = gameState.data?.players?.find(player => player.userid === Number(userId));
    if (currentPlayer) {
      return gameState.data?.bet_type === "1"
        ? formatNumber(Number(currentPlayer.money))
        : formatNumber(Number(currentPlayer.tokens));
    }
    return "0";
  }, [gameState.data, userId]);

  const handleShowEmojiOverlay = () => {
    setShowEmojiOverlay(true);
  };

  const handleCloseEmojiOverlay = () => {
    setShowEmojiOverlay(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    const data = {
      user_id: userId,
      room_id: roomId,
      type: 'emoji',
      emoji: emoji
    };
    sendMessage(data);
    setShowEmojiOverlay(false);

    setTimeout(() => {
      const noneData = {
        user_id: userId,
        room_id: roomId,
        type: 'emoji',
        emoji: 'none'
      };
      sendMessage(noneData);
    }, 3000);
  };

  const getActiveEmojis = useMemo(() => {
    if (!gameState.data?.players) return [];

    return gameState.data.players
      .filter((player: any) => {
        return player.emoji && player.emoji !== 'none' && player.emoji !== '';
      })
      .map((player: any) => ({
        userId: player.userid,
        emoji: player.emoji,
        name: player.publicname,
        avatar: player.avatar,
        position: getRandomPosition(),
        item: {
          item_pic: player.item_pic,
          item_mask: player.item_mask
        }
      }))
      .slice(0, 4);
  }, [gameState.data?.players]);

  if (!isPortrait) {
    return (
      <Warning />
    );
  }
  console.log(gameState.data?.win?.users);
  return (
    <div className={styles.game}>
      <div className={`${styles.game__content} ${gameState.winner ? styles.game__content_winner : ''}`}>
        {gameState.loading ? (
          <Loader />
        ) : (
          <>
            <p className={styles.game__roomCounter}>
              <RoomCounterIcon color="#626262" />
              {gameState.data?.players.length}
            </p>
            <div className={styles.game__head}>
              {showCoinsAnimation && (
                <img
                  src={coins}
                  alt="coins animation"
                  className={styles.game__coinsAnimation}
                />
              )}

              {getActiveEmojis && getActiveEmojis.length > 0 && getActiveEmojis.map((emojiData: any) => (
                <div
                  key={emojiData.userId}
                  className={styles.game__head__playerEmoji_container}
                  style={{
                    top: emojiData.position.top,
                    left: emojiData.position.left
                  }}
                >
                  <img
                    src={emojiData.emoji}
                    alt="player emoji"
                    className={styles.game__head__playerEmoji}
                  />
                  <div className={styles.game__head__avatarWrapper}>
                    <UserAvatar 
                      avatar={emojiData.avatar}
                      item={emojiData.item}
                    />
                  </div>
                </div>
              ))}

              <div className={styles.game__headInner}>
                <p className={styles.game__text}>{translation?.ludka_total_pot}</p>
                <p className={styles.game__money}>
                  {gameState.data?.win?.winner_value !== "none"
                    ? formatNumber(Number(gameState.data?.win?.winner_value))
                    : '0'}
                </p>
              </div>
            </div>
            <div className={styles.game__mainContainer}>
              <div className={`${styles.game__userContainer} 
                  ${gameState.winner ? styles.game__userContainer_winner : ''} 
                  ${styles[`game__userContainer_slide_${slideDirection}`]}`}>
                <div className={styles.game__avatarContainer}>
                  {gameState.winner
                    ? <UserAvatar item={gameState.winner?.item} avatar={gameState.winner?.user_pic} />
                    : gameState.data?.win?.users === "none"
                      ? <UserAvatar />
                      : <UserAvatar
                        item={{
                          item_pic: gameState.data?.win?.users[gameState?.data?.win?.users?.length - 1]?.item_pic,
                          item_mask: gameState.data?.win?.users[gameState?.data?.win?.users?.length - 1]?.item_mask
                        }}
                        avatar={gameState.data?.win?.users[gameState?.data?.win?.users?.length - 1]?.user_pic}
                      />
                  }
                </div>
                <div className={styles.game__userNameContainer}>
                  <p className={styles.game__userName}>
                    {gameState.winner
                      ? `${translation?.ludka_winner} ${gameState.winner.user_name}`
                      : gameState.data?.win?.users === "none"
                        ? userData?.publicname
                        : gameState.data?.win?.users[gameState.data.win.users.length - 1]?.user_name
                    }
                  </p>
                  <p className={styles.game__money}>
                    {gameState.data?.win?.users !== "none" ? "+" : ""}
                    {gameState.data?.win?.users !== "none"
                      ? <span>{gameState.data?.bet_type === "1" ? MONEY_EMOJI : SHIELD_EMOJI}</span>
                      : ""
                    }
                    <span className={styles.game__infoText}>
                      {gameState.winner
                        ? formatNumber(Number(gameState.winner.winner_value))
                        : gameState.data?.players_count === "1"
                          ? translation?.waiting4players
                          : gameState.data?.win?.users === "none"
                            ? "0"
                            : formatNumber(Number(gameState.data?.win?.users[gameState.data.win.users.length - 1]?.coins 
                              || 0))
                      }
                    </span>
                  </p>
                </div>
              </div>

              <div className={styles.game__infoContainer}>
                <div className={styles.game__betContainer}>
                  <p className={styles.game__text}>{translation?.ludka_current_bet}</p>
                  <p className={styles.game__bet}>
                    {gameState.data?.bet_type === "1" ? MONEY_EMOJI : SHIELD_EMOJI}
                    <span>{formatNumber(Number(gameState.data?.bet))}</span>
                  </p>
                  <button
                    className={styles.game__emojiButton}
                    onClick={handleShowEmojiOverlay}
                  >
                    <img src={emoji_icon}
                      alt="emoji icon"
                      className={styles.game__iconEmoji}
                    />
                  </button>
                </div>

                <div className={styles.game__infoInnerContainer}>
                  <div className={styles.game__info}>
                    <p className={styles.game__text}>{translation?.webapp_balance}</p>
                    <p className={styles.game__money}>
                      {gameState.data?.bet_type === "1" ? MONEY_EMOJI : SHIELD_EMOJI}
                      <span>
                        {currentPlayerBalance}
                      </span>
                    </p>
                  </div>

                  <button
                    className={styles.game__keysButton}
                    onClick={handleOpenOverlay}
                  >
                    <p className={styles.game__text}>{translation?.ludka_raise_to}</p>
                    <p className={styles.game__money}>
                      {gameState.data?.bet_type === "1" ? MONEY_EMOJI : SHIELD_EMOJI}
                      <span>{pendingBet || calculateNextBet()}</span>
                    </p>
                  </button>
                </div>
              </div>

              <div className={styles.game__buttonsContainer}>
                <button
                  className={styles.game__actionButton}
                  onClick={handleRaiseBet}
                  disabled={gameState.data?.players.length === 1}
                >
                  <span className={styles.game__actionButtonText}>
                    {errorMessage ? errorMessage : translation?.ludka_raise_bet}
                  </span>
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

      {overlayState.show && (
        <Overlay
          isVisible={overlayState.isVisible}
          inputValue={overlayState.inputValue}
          inputError={overlayState.inputError}
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onDecimalPoint={handleDecimalPoint}
          onSubmit={handleSubmit}
          overlayRef={overlayRef}
        />
      )}

      {logState.show && (
        <LogOverlay
          isVisible={logState.isVisible}
          onClose={handleCloseLog}
          overlayRef={logOverlayRef}
          users={gameState.data?.win?.users ?? "none"}
          shouldReset={logState.resetHistory}
        />
      )}

      <EmojiOverlay
        show={showEmojiOverlay}
        onClose={handleCloseEmojiOverlay}
        onEmojiSelect={handleEmojiSelect}
        backgroundColor="#323232"
      />
    </div>
  )
};

export default LudkaGame;
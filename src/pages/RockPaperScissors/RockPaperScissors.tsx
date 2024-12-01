/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useCallback, useEffect, useRef, useState, useContext, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { setGameRulesWatched } from "../../api/gameApi";
import { getAppData } from "../../api/mainApi";
import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";
import ChoiceBox from "../../components/Game/ChoiceBox/ChoiceBox";
import HandShake from '../../components/Game/HandShake/HandShake';
import Players from "../../components/Game/RPSPlayers/Players";
import Rules from "../../components/Game/Rules/Rules";
import Loader from "../../components/Loader/Loader";
import { Warning } from "../../components/OrientationWarning/Warning";
import useOrientation from "../../hooks/useOrientation";
import useTelegram from "../../hooks/useTelegram";
import emoji_icon from '../../images/rock-paper-scissors/emoji_icon.png';
import leftRock from '../../images/rock-paper-scissors/left_rock.png';
import rightRock from '../../images/rock-paper-scissors/right_rock.png';
import newVS from '../../images/rock-paper-scissors/VS_new.png';
import lLoseAnim from '../../images/rock-paper-scissors/winlose/l_lose.png';
import lWinAnim from '../../images/rock-paper-scissors/winlose/l_win.png';
import rLoseAnim from '../../images/rock-paper-scissors/winlose/r_lose.png';
import rWinAnim from '../../images/rock-paper-scissors/winlose/r_win.png';
import {
  addCoins,
  addTokens,
  setCoinsValueAfterBuy,
  setFirstGameRulesState,
  setTokensValueAfterBuy
} from "../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { WebSocketContext } from '../../socket/WebSocketContext';
import { indexUrl, roomsUrl } from "../../utils/routes";
import { IGameData, IPlayer, IRPSGameState } from "../../utils/types/gameTypes";
import { getUserId } from '../../utils/userConfig';

import styles from "./RockPaperScissors.module.scss";

export const RockPaperScissors: FC = () => {
  const navigate = useNavigate();
  const { tg } = useTelegram();
  const location = useLocation();
  const userId = getUserId();
  const { roomId } = useParams<{ roomId: string | any }>();
  const dispatch = useAppDispatch();
  const [gameState, setGameState] = useState<IRPSGameState>({
    data: null,
    loading: false,
    message: '',
    messageVisible: false,
    animation: null,
    playersAnim: { firstAnim: null, secondAnim: null }
  });
  const [choice, setChoice] = useState<string>('');
  const [animationKey, setAnimationKey] = useState(0);
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [playersAnim, setPlayersAnim] = useState({ firstAnim: null, secondAnim: null });
  const [timer, setTimer] = useState<number>(15);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showTimer, setShowTimer] = useState(true);
  const [rules, setRulesShown] = useState<boolean | null>(false);
  const [isChoiceLocked, setIsChoiceLocked] = useState<boolean>(false);
  const [whoIsWinActive, setIsWhoIsWinActive] = useState<boolean>(false);
  const translation = useAppSelector(store => store.app.languageSettings);
  const isRulesShown = useAppSelector(store => store.app.firstGameRulesState);
  const ruleImage = useAppSelector(store => store.app.RPSRuleImage);
  const isPortrait = useOrientation();
  const userData = useAppSelector(store => store.app.info);
  const { sendMessage, wsMessages, clearMessages, disconnect } = useContext(WebSocketContext)!;
  const currentPlayer = useMemo(() => {
    return gameState.data?.players?.find((player: IPlayer) => Number(player?.userid) === Number(userId));
  }, [gameState.data?.players, userId]);

  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      sendMessage({
        user_id: userId,
        room_id: roomId,
        type: 'kickplayer'
      });
      clearMessages();
      navigate(indexUrl, { replace: true });
    });
    
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
      clearMessages();
      setGameState(prev => ({
        ...prev,
        data: null,
        loading: false,
        message: '',
        messageVisible: false,
        animation: null,
        playersAnim: { firstAnim: null, secondAnim: null }
      }));
    }
  }, [tg, navigate, userId]);
  // запрос результата хода
  const updateAnimation = useCallback((newAnimation: string) => {
    setGameState(prev => ({
      ...prev,
      animation: prev.animation !== newAnimation ? newAnimation : prev.animation
    }));
  }, []);

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      loading: true
    }));

    if (!roomId) {
      setGameState(prev => ({
        ...prev,
        loading: false
      }));
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

  const handleWebSocketMessage = useCallback((message: string) => {
    const res = JSON.parse(message);
    switch (res?.type) {
      case 'room_info':
        handleRoomInfo(res);
        break;
      case 'whoiswin':
        handleWinnerMessage(res);
        break;
      case 'choice':
        setGameState(prev => ({
          ...prev,
          data: res
        }));
        break;
      case 'emoji':
        setGameState(prev => ({
          ...prev,
          data: res
        }));
        break;
      case 'kickplayer':
        if (Number(res?.player_id) === Number(userId)) {
          clearMessages();
          setGameState(prev => ({
            ...prev,
            data: null,
            loading: false,
            message: '',
            messageVisible: false,
            animation: null,
            playersAnim: { firstAnim: null, secondAnim: null }
          }));
          disconnect();
          navigate(indexUrl, { replace: true });
        }
        break;
      default:
        break;
    }
  }, []);

  const handleRoomInfo = useCallback((res: any) => {
    setGameState(prev => ({
      ...prev,
      data: res,
      loading: false
    }));
  }, []);

  const handleWinnerMessage = useCallback((res: any) => {
    setIsWhoIsWinActive(true);
    setPlayersAnim({
      firstAnim: res?.whoiswin.f_anim,
      secondAnim: res?.whoiswin.s_anim,
    });
    const animationTime = 3000;
    setAnimationKey(prevKey => prevKey + 1);
    setTimeout(() => {
      if (Number(res?.whoiswin.winner) === Number(userId)) {
        updateAnimation(Number(gameState.data?.creator_id) === Number(res?.whoiswin.winner) ? lWinAnim : rWinAnim);
        // postEvent(
        //   'web_app_trigger_haptic_feedback',
        //   { type: 'notification', notification_type: 'success' }
        // );
        setGameState(prev => ({
          ...prev,
          message: `${translation?.you_won} ${res?.whoiswin.winner_value !== 'none'
            ? `${res?.whoiswin.winner_value} ${gameState.data?.bet_type === "1" ? `💵`
              : `🔰`}`
            : ''}`
        }));
        if (gameState.data?.bet_type === "1") {
          dispatch(addCoins(Number(res?.whoiswin.winner_value)));
        } else {
          dispatch(addTokens(Number(res?.whoiswin.winner_value)));
        }
      } else if (Number(res?.whoiswin.winner_value) !== Number(userId) && res?.whoiswin.winner !== 'draw') {
        updateAnimation(Number(gameState.data?.creator_id) === Number(res?.whoiswin.winner) ? lLoseAnim : rLoseAnim);
        // postEvent(
        //   'web_app_trigger_haptic_feedback',
        //   { type: 'notification', notification_type: 'error', }
        // );
        setGameState(prev => ({
          ...prev,
          message: `${translation?.you_lost} ${gameState.data?.bet} ${gameState.data?.bet_type === "1"
            ? `💵`
            : `🔰`}`
        }));
        if (gameState.data?.bet_type === "3") {
          dispatch(setTokensValueAfterBuy(Number(res?.whoiswin.winner_value)));
        } else {
          dispatch(setCoinsValueAfterBuy(Number(res?.whoiswin.winner_value)));
        }
      } else if (res?.whoiswin.winner === 'draw') {
        setGameState(prev => ({
          ...prev,
          message: translation?.draw
        }));
        // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
      }
      setMessageVisible(true);

      setTimeout(() => {
        setMessageVisible(false);
        setGameState(prev => ({
          ...prev,
          animation: null,
          playersAnim: {
            firstAnim: null,
            secondAnim: null,
          }
        }));
        clearMessages();
        setShowTimer(true);
        setIsWhoIsWinActive(false);
      }, 3500)

    }, animationTime);
  }, [gameState.data, userId, dispatch, translation]);

  useEffect(() => {
    wsMessages.forEach(message => {
      handleWebSocketMessage(message);
    });
  }, [wsMessages, handleWebSocketMessage]);
  // проверка правил при старте игры
  useEffect(() => {
    setRulesShown(isRulesShown);
  }, [dispatch, isRulesShown]);
  // хендлер готовности игрока websocket
  const handleReady = () => {
    if (whoIsWinActive) return;
    const player = gameState.data?.players.find((player: any) => Number(player?.userid) === Number(userId));

    if (gameState.data?.bet_type === "1") {
      if (player?.money && (player?.money <= Number(gameState.data?.bet))) {
        sendMessage({
          user_id: player?.userid,
          room_id: roomId,
          type: 'kickplayer'
        });

        if (player?.userid === userId) {
          const currentUrl = location.pathname;
          currentUrl !== roomsUrl && navigate(roomsUrl);
        }
        // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
        return;
      }
    } else if (gameState.data?.bet_type === "3") {
      if (player?.tokens && (player?.tokens <= Number(gameState.data?.bet))) {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });

        // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
        return;
      }
    }
    // Сброс сообщений и блокировок выбора
    setMessageVisible(false);
    setIsChoiceLocked(false);
    setGameState(prev => ({
      ...prev,
      message: ''
    }));

    sendMessage({
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: 'ready'
    });

    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
  };
  // хендлер выбора хода Websocket
  const handleChoice = (value: string) => {
    if (isChoiceLocked) return;
    setIsChoiceLocked(true);
    setTimerStarted(false);
    setShowTimer(false);
    const choice = {
      user_id: userId,
      room_id: roomId,
      type: 'choice',
      choice: value
    };

    sendMessage(choice);
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
  };
  // хендлер отпрвки эмодзи websocket
  const handleEmojiSelect = (emoji: string) => {
    const data = {
      user_id: userId,
      room_id: roomId,
      type: 'emoji',
      emoji: emoji
    };
    sendMessage(data);
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
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
  // Таймер
  useEffect(() => {
    if (gameState.data?.players_count === "2" && showTimer
      && (gameState.data?.players?.some((player: IPlayer) => player.choice === 'none')
        || (gameState.data?.players?.some((player: IPlayer) => player.choice === 'ready')))) {
      if (!timerStarted) {
        setTimerStarted(true);
        setTimer(20);
      }

      setShowTimer(true);
    } else if (gameState.data?.players?.every((player: IPlayer) => player.choice === 'ready')) {
      setTimerStarted(false);
      setShowTimer(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else if (gameState.data?.players_count === "1") {
      setTimerStarted(false);
      setTimer(20);
    }
  }, [gameState]);
  // кик игрока, если он не прожал готовность
  useEffect(() => {
    if (showTimer && timerStarted && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      if (currentPlayer?.choice === 'none' || currentPlayer?.choice === 'ready') {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer, timerStarted, navigate, userId]);
  // сброс выбора игрока, когда он единственный в комнате Websocket
  useEffect(() => {
    const resetPlayerChoice = () => {
      const choiceData = {
        user_id: userId,
        room_id: roomId,
        type: 'choice',
        choice: 'none'
      };
      sendMessage(choiceData);
    };

    if (gameState.data?.players_count === "1" 
      && gameState.data?.players.some((player: any) => player.choice !== 'none')) {
      resetPlayerChoice();
    }
  }, [gameState]);
  // обработчик клика по кнопке "Ознакомился" - не Websocket
  const handleRuleButtonClick = () => {
    setGameRulesWatched(userId, '1');
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
    setRulesShown(true);
    setTimeout(() => {
      getAppData(userId)
        .then((res) => {
          dispatch(setFirstGameRulesState(res.game_rule_1_show));
        })
        .catch((error) => {
          console.error('Get user data error:', error);
        })
    }, 1000);
  };

  const handleShowEmojiOverlay = () => {
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
    setShowEmojiOverlay(true);
  };

  const handleCloseEmojiOverlay = () => {
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
    setShowEmojiOverlay(!showEmojiOverlay)
  };

  if (!isPortrait) {
    return (
      <Warning />
    );
  }

  return (
    <div className={styles.game}>
      <div
        className={styles.game__result}
        style={{ backgroundImage: `url(${gameState.animation}?key=${animationKey})` }}
      >
        {gameState.loading ? <Loader /> : (
          <>
            {rules ? (
              <>
                <Players data={gameState.data as IGameData} userData={userData} />
                <>
                  {gameState.data?.players_count === "2" &&
                    gameState.data?.players?.every((player: IPlayer) => player?.choice === 'ready') &&
                    <img src={newVS}
                      alt="versus icon"
                      className={styles.game__versusImage} />}
                  {messageVisible ? (
                    <p className={styles.game__resultMessage}>
                      {gameState.message}
                    </p>
                  ) : (
                    <p className={styles.game__timer}>
                      {showTimer && timerStarted && `0:${timer}`}
                    </p>
                  )}
                  <div className={styles.game__hands}>
                    {(
                      gameState.data?.players_count === "2"
                    ) ? (
                      <HandShake
                        player1={playersAnim.firstAnim || leftRock}
                        player2={playersAnim.secondAnim || rightRock} />
                    ) : (
                      gameState.data?.players_count === "1"
                    ) ? (
                      <p className={styles.game__notify}>{translation?.waiting4players}</p>
                    ) :
                      ''}
                  </div>
                  <div className={styles.game__lowerContainer}>
                    <div className={styles.game__betContainer}>
                      <p className={styles.game__text}>{translation?.game_bet_text}</p>
                      <div className={styles.game__bet}>
                        <p className={styles.game__text}>{gameState.data?.bet_type === "1" ? "💵" : "🔰"}</p>
                        <p className={styles.game__text}>{gameState.data?.bet}</p>
                      </div>
                    </div>
                    {(gameState.data?.players?.every((player: IPlayer) => player?.choice !== 'none')
                      && gameState.data?.players_count === "2") ? (
                      <div className={styles.game__buttonsWrapper}>
                        <ChoiceBox
                          choice={choice}
                          isChoiceLocked={isChoiceLocked}
                          handleChoice={handleChoice}
                        />
                      </div>
                    ) : (
                      <div className={styles.game__readyWrapper}>
                        <input
                          type="checkbox"
                          id="ready"
                          onChange={handleReady}
                          className={styles.game__checkbox} />
                        <label htmlFor="ready"
                          className={styles.game__label} />
                      </div>
                    )}
                    <button
                      type="button"
                      className={`${styles.game__button} ${styles.game__emojiButton}`}
                      onClick={handleShowEmojiOverlay}
                    >
                      <img src={emoji_icon}
                        alt="emoji icon"
                        className={styles.game__iconEmoji} />
                    </button>
                  </div>
                </>
              </>
            ) : (
              <Rules
                handleRuleButtonClick={handleRuleButtonClick}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ruleImage={ruleImage!}
              />
            )
            }
          </>
        )}
        <EmojiOverlay
          show={showEmojiOverlay}
          onClose={handleCloseEmojiOverlay}
          onEmojiSelect={handleEmojiSelect}
        />
      </div>
    </div>
  );
};
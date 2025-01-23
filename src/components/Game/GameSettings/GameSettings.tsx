/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../../services/reduxHooks';
import { WebSocketContext } from '../../../socket/WebSocketContext';
import { formatNumber } from '../../../utils/additionalFunctions';
import { MONEY_EMOJI, SHIELD_EMOJI } from '../../../utils/constants';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';
import { IGameSettingsData } from '../../../utils/types/gameTypes';
import { getUserId } from '../../../utils/userConfig';
import { Modal } from '../../Modal/Modal';
import Button from '../../ui/Button/Button';
import JoinRoomPopup from '../JoinRoomPopup/JoinRoomPopup';
import SettingsSlider from '../SettingsSlider/SettingsSlider';

import styles from './GameSettings.module.scss';

interface IProps {
  data: IGameSettingsData | null;
  closeOverlay: () => void;
}

const GameSettings: FC<IProps> = ({ data, closeOverlay }) => {
  const navigate = useNavigate();
  const userId = getUserId();
  const mountedRef = useRef(true);
  const wsTimeoutRef = useRef<NodeJS.Timeout>();
  const initRef = useRef(false);
  const [bet, setBet] = useState(0.1);
  const [currency, setCurrency] = useState(1);
  const [notification, setNotification] = useState({
    message: '',
    isShown: false,
    isInsufficient: false
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);
  const translation = useAppSelector(store => store.app.languageSettings);
  const userEnergy = useAppSelector(store => store.app.info?.user_energy);
  const userInfo = useAppSelector(store => store.app.info);
  const { sendMessage, wsMessages, connect, clearMessages } = useContext(WebSocketContext)!;

  const setViewportHeight = useCallback(() => {
    if (window.Telegram?.WebApp?.viewportStableHeight) {
      const height = window.Telegram.WebApp.viewportStableHeight;
      document.documentElement.style.setProperty('--tg-viewport-stable-height', `${height}px`);
      document.documentElement.style.setProperty('--tg-viewport-height', `${window.Telegram.WebApp.viewportHeight}px`);
    }
  }, []);

  useEffect(() => {
    if (!initRef.current) {
      const initializeComponent = async () => {
        if (!mountedRef.current) return;
        
        try {
          clearMessages();
          
          if (!wsMessages || wsMessages.length === 0) {
            connect();
            await new Promise(resolve => {
              wsTimeoutRef.current = setTimeout(resolve, 1000);
            });
          }

          setViewportHeight();
          window.addEventListener('resize', setViewportHeight);

          initRef.current = true;
        } catch (error) {
          console.error('Error initializing component:', error);
        }
      };

      initializeComponent();
    }

    return () => {
      mountedRef.current = false;
      if (wsTimeoutRef.current) {
        clearTimeout(wsTimeoutRef.current);
      }
      window.removeEventListener('resize', setViewportHeight);
    };
  }, [clearMessages, connect, wsMessages, setViewportHeight]);

  const showNotification = useCallback((message: string, isInsufficient = false) => {
    if (!mountedRef.current) return;
    
    setNotification({
      message,
      isShown: true,
      isInsufficient
    });
    setTimeout(() => {
      if (mountedRef.current) {
        setNotification(prev => ({ ...prev, isShown: false, isInsufficient: false }));
      }
    }, 2000);
  }, []);

  useEffect(() => {
    if (wsMessages?.length > 0) {
      try {
        const lastMessage = JSON.parse(wsMessages[wsMessages.length - 1]);
        if (lastMessage?.message?.message === 'success') {
          triggerHapticFeedback('notification', 'success');
          setSelectedRoomId(lastMessage.message.room_id);
          const roomRoutes = {
            2: `/closest/${lastMessage?.message?.room_id}`,
            3: `/ludkaGame/${lastMessage?.message?.room_id}`,
            4: `/monetka/${lastMessage?.message?.room_id}`,
            default: `/room/${lastMessage?.message?.room_id}`
          };
          navigate(roomRoutes[data?.room_type as keyof typeof roomRoutes] || roomRoutes.default);
        } else if (lastMessage?.message?.type === 'error') {
          showNotification(translation?.insufficient_funds || 'Недостаточно средств', true);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [wsMessages, navigate, translation, data, showNotification]);

  const handleCreateRoom = useCallback(async (
    userIdValue: number,
    bet: number,
    betType: number,
    roomType: number,
    closeOverlay: () => void
  ) => {
    if (!mountedRef.current) return;

    setIsLoading(true);
    try {
      clearMessages();
      if (!wsMessages || wsMessages.length === 0) {
        connect();
        await new Promise(resolve => {
          wsTimeoutRef.current = setTimeout(resolve, 1000);
        });
      }

      sendMessage({
        type: 'create_room',
        user_id: userIdValue,
        bet,
        bet_type: betType,
        room_type: roomType,
      });
    } catch (error) {
      console.error('Error creating room:', error);
      showNotification(translation?.error_creating_room || 'Ошибка создания комнаты');
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [wsMessages, connect, clearMessages, sendMessage, translation, showNotification]);

  const handleEnergyCheck = useCallback(() => {
    if (bet < 0.1) {
      showNotification(`${translation?.minimum_bet} ${currency === 1 ? MONEY_EMOJI : SHIELD_EMOJI}`);
      return;
    }

    if (userInfo) {
      const coins = userCoins ?? 0;
      const tokens = userTokens ?? 0;

      if ((currency === 1 && bet > coins) || (currency === 3 && bet > tokens)) {
        showNotification(translation?.insufficient_funds || 'Недостаточно средств');
      } else if (userEnergy === 0 && currency === 3) {
        setPopupOpen(true);
      } else if (data) {
        handleCreateRoom(userId, bet, currency, data?.room_type, closeOverlay);
      }
    }
  }, [bet, currency, userInfo, userCoins, userTokens, userEnergy, data, 
    translation, showNotification, handleCreateRoom, userId, closeOverlay]);

  const handleCurrencyChange = (newCurrency: number) => setCurrency(newCurrency);
  const handleBetChange = (newBet: number) => setBet(newBet);
  const handleInputChange = (bet: string) => setBet(parseFloat(bet));

  const getGameTitle = () => {
    const titles = {
      1: translation?.rock_paper_scissors,
      2: translation?.closest_number,
      3: translation?.ludka_name,
      4: translation?.monetka_name
    };
    return titles[data?.room_type as keyof typeof titles] || '';
  };

  return (
    <main className={styles.game + ' scrollable'} role="main">
      {notification.isShown ? (
        <section 
          className={styles.game__notification}
          role="alert"
          aria-live="polite"
        >
          {notification.message}
        </section>
      ) : notification.isInsufficient ? (
        <section 
          className={styles.game__notification}
          role="alert"
          aria-live="polite"
        >
          {translation?.insufficient_funds}
        </section>
      ) : (
        <>
          <img 
            src={data?.url} 
            alt={getGameTitle()}
            className={styles.game__logo}
          />
          <section className={styles.game__content}>
            <h1 className={styles.game__title}>
              {getGameTitle()}
            </h1>
            <section className={styles.game__balance} aria-label="User Balance">
              <h2 className={styles.game__text}>{translation?.user_balance}</h2>
              <div className={styles.game__balanceWrapper}>
                <p className={styles.game__text}>
                  <span>{MONEY_EMOJI}</span> 
                   {userCoins !== undefined ? formatNumber(userCoins) : 0}
                </p>
                <p className={styles.game__text}>
                  <span>{SHIELD_EMOJI}</span> 
                  {userTokens !== undefined ? formatNumber(userTokens) : 0}
                </p>
              </div>
            </section>
            <section className={styles.game__menu} aria-label="Game Settings">
              <h2 className={styles.game__text}>{translation?.bet_in_room}</h2>
              <div className={styles.game__buttons}>
                <SettingsSlider
                  betValue={bet}
                  isCurrency={false}
                  onBetChange={handleBetChange}
                  onInputChange={handleInputChange}
                />
                <SettingsSlider
                  isCurrency
                  onCurrencyChange={handleCurrencyChange}
                />
              </div>
            </section>
            <div className={styles.game__buttonWrapper}>
              <Button
                disabled={isNaN(bet) || bet <= 0}
                text={translation?.create_room_button}
                handleClick={handleEnergyCheck}
              />
            </div>
          </section>
        </>
      )}
      {isPopupOpen && (
        <Modal 
          title={translation?.energy_depleted} 
          closeModal={() => setPopupOpen(false)}
        >
          <JoinRoomPopup
            handleClick={() => setPopupOpen(false)}
            roomId={selectedRoomId ?? ''}
            bet={bet}
            betType={currency}
            roomType={data?.room_type}
            fromGameSettings
          />
        </Modal>
      )}
    </main>
  );
};

export default GameSettings;
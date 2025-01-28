/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState, useContext } from 'react';
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
import NumericKeyboard from '../NumericKeyboard/NumericKeyboard';
import SettingsSlider from '../SettingsSlider/SettingsSlider';

import styles from './GameSettings.module.scss';

interface IProps {
  data: IGameSettingsData | null;
  closeOverlay: () => void;
}

const GameSettings: FC<IProps> = ({ data, closeOverlay }) => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [betString, setBetString] = useState('0');
  const [currency, setCurrency] = useState(1);
  const [notification, setNotification] = useState({
    message: '',
    isShown: false,
    isInsufficient: false
  });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);
  const translation = useAppSelector(store => store.app.languageSettings);
  const userEnergy = useAppSelector(store => store.app.info?.user_energy);
  const userInfo = useAppSelector(store => store.app.info);
  const { sendMessage, wsMessages, connect, clearMessages } = useContext(WebSocketContext)!;
  const parsedMessages = wsMessages?.map(msg => JSON.parse(msg));

  const showNotification = (message: string, isInsufficient = false) => {
    setNotification({
      message,
      isShown: true,
      isInsufficient
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isShown: false, isInsufficient: false }));
    }, 2000);
  };

  useEffect(() => {
    if (parsedMessages?.length > 0) {
      const lastMessage = parsedMessages[wsMessages?.length - 1]?.message;
      if (lastMessage && lastMessage?.message === 'success') {
        triggerHapticFeedback('notification', 'success');
        setSelectedRoomId(lastMessage.room_id);
        
        const roomType = lastMessage.room_type || data?.room_type;
        
        const roomRoutes = {
          1: `/room/${lastMessage?.room_id}`,
          2: `/closest/${lastMessage?.room_id}`,
          3: `/ludkaGame/${lastMessage?.room_id}`,
          4: `/monetka/${lastMessage?.room_id}`,
          // default: `/room/${lastMessage?.room_id}`
        };
        
        if (!roomType) {
          console.error('Room type is undefined', { lastMessage, data });
          showNotification(translation?.error_creating_room || 'Ошибка создания комнаты');
          return;
        }
        
        navigate(roomRoutes[roomType as keyof typeof roomRoutes]);
      } else if (lastMessage?.type === 'error') {
        showNotification(translation?.insufficient_funds || 'Недостаточно средств', true);
      }
    }
  }, [parsedMessages, navigate, translation, data]);

  const handleCurrencyChange = (newCurrency: number) => setCurrency(newCurrency);

  const handleBetChange = (newBet: number) => {
    setBetString(newBet.toFixed(1));
  };

  const handleCreateRoom = async (
    userIdValue: number,
    bet: number,
    betType: number,
    roomType: number,
  ) => {
    try {
      clearMessages();
      if (!wsMessages || wsMessages.length === 0) {
        connect();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      sendMessage({
        type: 'create_room',
        user_id: userIdValue,
        bet,
        bet_type: betType,
        room_type: roomType,
      });
      setTimeout(() => {
        closeOverlay();
      }, 1000);
    } catch (error) {
      console.error('Error creating room:', error);
      showNotification(translation?.error_creating_room || 'Ошибка создания комнаты');
    }
  };

  const handleEnergyCheck = () => {
    const numericBet = parseFloat(betString);
    if (numericBet < 0.1) {
      showNotification(`${translation?.minimum_bet} ${currency === 1 ? `💵` : `🔰`}`);
      return;
    }

    if (userInfo) {
      const coins = userCoins ?? 0;
      const tokens = userTokens ?? 0;

      if ((currency === 1 && numericBet > coins) || (currency === 3 && numericBet > tokens)) {
        showNotification(translation?.insufficient_funds || 'Недостаточно средств');
      } else if (userEnergy === 0 && currency === 3) {
        setPopupOpen(true);
      } else if (data) {
        handleCreateRoom(userId, numericBet, currency, data?.room_type);
      }
    }
  };

  const getGameTitle = () => {
    const titles = {
      1: translation?.rock_paper_scissors,
      2: translation?.closest_number,
      3: translation?.ludka_name,
      4: translation?.monetka_name
    };
    return titles[data?.room_type as keyof typeof titles] || '';
  };

  useEffect(() => {
    if (!data) {
      setShowKeyboard(false);
    }
  }, [data]);

  if (showKeyboard) {
    return (
      <NumericKeyboard
        onClose={() => setShowKeyboard(false)}
        onConfirm={(value) => {
          const numericBet = parseFloat(value || '0');
          if (!isNaN(numericBet)) {
            setBetString(numericBet.toFixed(1));
          }
          setShowKeyboard(false);
        }}
        onBack={() => setShowKeyboard(false)}
      />
    );
  }

  return (
    <main className={`${styles.game} scrollable`} role="main">
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
                  betValue={betString}
                  isCurrency={false}
                  onBetChange={handleBetChange}
                  onInputChange={setBetString}
                  onKeyboardShow={setShowKeyboard}
                />
                <SettingsSlider
                  isCurrency
                  onCurrencyChange={handleCurrencyChange}
                />
              </div>
            </section>
            <div className={styles.game__buttonWrapper}>
              <Button
                disabled={isNaN(parseFloat(betString)) || parseFloat(betString) <= 0}
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
            bet={parseFloat(betString)}
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
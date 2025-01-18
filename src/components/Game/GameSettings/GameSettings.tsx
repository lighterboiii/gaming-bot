/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from '@tma.js/sdk';
import { FC, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../../services/reduxHooks';
import { WebSocketContext } from '../../../socket/WebSocketContext';
import { formatNumber } from '../../../utils/additionalFunctions';
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
  const [bet, setBet] = useState(0.1);
  const [currency, setCurrency] = useState(1);
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);
  const [insufficient, setInsufficient] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);
  const translation = useAppSelector(store => store.app.languageSettings);
  const userEnergy = useAppSelector(store => store.app.info?.user_energy);
  const userInfo = useAppSelector(store => store.app.info);
  const { sendMessage, wsMessages, connect, clearMessages } = useContext(WebSocketContext)!;
  const parsedMessages = wsMessages?.map(msg => JSON.parse(msg));

  useEffect(() => {
    if (parsedMessages?.length > 0) {
      const lastMessage = parsedMessages[wsMessages?.length - 1]?.message;
      console.log(lastMessage);
      if (lastMessage && lastMessage?.message === 'success') {
        setSelectedRoomId(lastMessage.room_id);
        navigate(data?.room_type === 2 
            ? `/closest/${lastMessage?.room_id}` 
            : data?.room_type === 3
              ? `/ludkaGame/${lastMessage?.room_id}`
              : data?.room_type === 4
                ? `/monetka/${lastMessage?.room_id}`
                : `/room/${lastMessage?.room_id}`);
      } else if (lastMessage?.type === 'error') {
        setInsufficient(true);
        setMessage(translation?.insufficient_funds || 'Недостаточно средств');
        setMessageShown(true);
        setTimeout(() => {
          setMessageShown(false);
          setInsufficient(false);
        }, 2000);
      }
    }
  }, [parsedMessages, navigate, translation, data]);

  const handleCurrencyChange = (newCurrency: number) => {
    setCurrency(newCurrency);
  };

  const handleBetChange = (newBet: number) => {
    setBet(newBet);
  };

  const handleInputChange = (bet: string) => {
    setBet(parseFloat(bet));
  };
  const handleCreateRoom = async (
    userIdValue: number, 
    bet: number, 
    betType: number, 
    roomType: number, 
    closeOverlay: () => void
  ) => {
    try {
      clearMessages();
      if (!wsMessages || wsMessages.length === 0) {
        connect();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const data = {
        type: 'create_room',
        user_id: userIdValue,
        bet: bet,
        bet_type: betType,
        room_type: roomType,
      };
      
      sendMessage(data);
    } catch (error) {
      console.error('Error creating room:', error);
      setMessage(translation?.error_creating_room || 'Ошибка создания комнаты');
      setMessageShown(true);
      setTimeout(() => {
        setMessageShown(false);
      }, 2000);
    }
  };

  const handleEnergyCheck = () => {
    if (bet < 0.1) {
      setMessage(`${translation?.minimum_bet} ${currency === 1 ? `💵` : `🔰`}`);
      setMessageShown(true);
      setTimeout(() => {
        setMessageShown(false);
      }, 2000);
      return;
    }

    if (userInfo) {
      const coins = userCoins ?? 0;
      const tokens = userTokens ?? 0;

      if ((currency === 1 && bet > coins) || (currency === 3 && bet > tokens)) {
        setMessage(translation?.insufficient_funds || 'Недостаточно средств');
        setMessageShown(true);
        setTimeout(() => {
          setMessageShown(false);
        }, 2000);
      } else if (userEnergy === 0 && currency === 3) {
        setPopupOpen(true);
      } else if (data) {
        handleCreateRoom(userId, bet, currency, data?.room_type, closeOverlay);
      }
    }
  };

  return (
    <div className={styles.game + ' scrollable'}>
      {messageShown ? (
        <div className={styles.game__notification}>
          {message}
        </div>
      ) : insufficient ? (
        <div className={styles.game__notification}>
          {translation?.insufficient_funds}
        </div>
      ) : (
        <>
          <div style={{ backgroundImage: `url(${data?.url})` }} className={styles.game__logo} />
          <div className={styles.game__content}>
            <h3 className={styles.game__title}>
              {data?.room_type === 1 
                ? `${translation?.rock_paper_scissors}` 
                : data?.room_type === 2 
                  ? `${translation?.closest_number}`
                  : data?.room_type === 3 
                    ? `${translation?.ludka_name}`
                    :  `${translation?.monetka_name}`}
            </h3>
            <div className={styles.game__balance}>
              <p className={styles.game__text}>{translation?.user_balance}</p>
              <div className={styles.game__balanceWrapper}>
                <p className={styles.game__text}>💵 {userCoins !== undefined ? formatNumber(userCoins) : 0}</p>
                <p className={styles.game__text}>🔰 {userTokens !== undefined ? formatNumber(userTokens) : 0}</p>
              </div>
            </div>
            <div className={styles.game__menu}>
              <p className={styles.game__text}>{translation?.bet_in_room}</p>
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
            </div>
            <div className={styles.game__buttonWrapper}>
              <Button
                disabled={isNaN(bet) || bet <= 0}
                text={translation?.create_room_button}
                handleClick={handleEnergyCheck}
              />
            </div>
          </div>
        </>
      )}
      {isPopupOpen && (
        <Modal title={translation?.energy_depleted} closeModal={() => setPopupOpen(false)}>
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
    </div>
  );
};

export default GameSettings;
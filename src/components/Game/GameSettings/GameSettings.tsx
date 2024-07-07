/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import styles from './GameSettings.module.scss';
import Button from '../../ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../services/reduxHooks';
import { formatNumber } from '../../../utils/additionalFunctions';
import { userId } from '../../../api/requestData';
import { postNewRoomRequest } from '../../../api/gameApi';
import useTelegram from '../../../hooks/useTelegram';
import SettingsSlider from '../SettingsSlider/SettingsSlider';
import { IGameSettingsData } from '../../../utils/types/gameTypes';
import { Modal } from '../../Modal/Modal';
import JoinRoomPopup from '../JoinRoomPopup/JoinRoomPopup';
import { postEvent } from '@tma.js/sdk';

interface IProps {
  data: IGameSettingsData | null;
  closeOverlay: () => void;
}

const GameSettings: FC<IProps> = ({ data, closeOverlay }) => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const userId = user?.id;
  const dispatch = useAppDispatch();
  const [bet, setBet] = useState(0.1);
  const [currency, setCurrency] = useState(1);
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);
  const [insufficient, setInsufficient] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<any | null>(null);
  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);
  const translation = useAppSelector(store => store.app.languageSettings);
  const userEnergy = useAppSelector(store => store.app.info?.user_energy);
  const userInfo = useAppSelector(store => store.app.info);

  const handleCurrencyChange = (newCurrency: number) => {
    setCurrency(newCurrency);
  };

  const handleBetChange = (newBet: number) => {
    setBet(newBet);
  };

  const handleInputChange = (bet: string) => {
    setBet(parseFloat(bet));
  };

  const handleCreateRoom = (
    userIdValue: string,
    bet: number,
    betType: number,
    roomType: number,
    closeOverlay: () => void) => {
    const data = {
      user_id: userIdValue,
      bet: bet,
      bet_type: betType,
      room_type: roomType
    };
    const handleResponse = (response: any) => {
      if (response.message === 'success') {
        setSelectedRoomId(response.room_id);
        // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success' });
        navigate(roomType === 2 ? `/closest/${response.room_id}` : `/room/${response.room_id}`);
      } else if (response.message === 'not_enough_coins') {
        setInsufficient(true);
        setTimeout(() => {
          closeOverlay();
          setInsufficient(false);
        }, 2000)
      }
    };
    postNewRoomRequest(data, userIdValue)
      .then(handleResponse)
      .catch(error => {
        console.log(error);
      });
  };

  const handleEnergyCheck = () => {
    if ((userInfo && currency === 1 && bet > userCoins!) || (userInfo && currency === 3 && bet > userTokens!)) {
      setInsufficient(true);
      setTimeout(() => {
        setInsufficient(false);
      }, 2000)
    } else if (userEnergy === 0 && currency === 3) {
      setPopupOpen(true);
    } else {
      handleCreateRoom(userId, bet, currency, data!.id, closeOverlay);
    }
  };

  return (
    <div className={styles.game + 'scrollable'}>
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
              {data?.room_type === 1 ? `${translation?.rock_paper_scissors}` : `${translation?.closest_number}`}
            </h3>
            <div className={styles.game__balance}>
              <p className={styles.game__text}>{translation?.user_balance}</p>
              <div className={styles.game__balanceWrapper}>
                <p className={styles.game__text}>💵 {userCoins && formatNumber(userCoins)}</p>
                <p className={styles.game__text}>🔰 {userTokens && formatNumber(userTokens)}</p>
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
            roomId={selectedRoomId}
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
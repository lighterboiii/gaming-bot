/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { postNewRoomRequest } from '../../../api/gameApi';
import { userId } from '../../../api/requestData';
import useTelegram from '../../../hooks/useTelegram';
import { useAppDispatch, useAppSelector } from '../../../services/reduxHooks';
import { formatNumber } from '../../../utils/additionalFunctions';
import { IGameSettingsData } from '../../../utils/types/gameTypes';
import { ICreateRoomResponse } from '../../../utils/types/responseTypes';
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
  const { user } = useTelegram();
  const dispatch = useAppDispatch();
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
  console.log(selectedRoomId);
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
    userIdValue: number,
    bet: number,
    betType: number,
    roomType: number,
    closeOverlay: () => void
  ) => {
    const data = {
      user_id: userIdValue,
      bet: bet,
      bet_type: betType,
      room_type: roomType
    };
    const handleResponse = (response: ICreateRoomResponse) => {
      console.log(response);
      if (response.message === 'success') {
        setSelectedRoomId(String(response.room_id));
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
      .then((response) => handleResponse(response as ICreateRoomResponse))
      .catch(error => {
        console.log(error);
      });
  };

  const handleEnergyCheck = () => {
    if (userInfo) {
      const coins = userCoins ?? 0;
      const tokens = userTokens ?? 0;

      if ((currency === 1 && bet > coins) || (currency === 3 && bet > tokens)) {
        setInsufficient(true);
        setTimeout(() => {
          setInsufficient(false);
        }, 2000);
      } else if (userEnergy === 0 && currency === 3) {
        setPopupOpen(true);
      } else if (data) {
        handleCreateRoom(userId, bet, currency, data.id, closeOverlay);
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
              {data?.room_type === 1 ? `${translation?.rock_paper_scissors}` : `${translation?.closest_number}`}
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

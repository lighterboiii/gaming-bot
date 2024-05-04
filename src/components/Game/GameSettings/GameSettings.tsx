/* eslint-disable react-hooks/exhaustive-deps */
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

interface IProps {
  data: any; // TODO типизировать
}

const GameSettings: FC<IProps> = ({ data }) => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const userId = user?.id;
  const dispatch = useAppDispatch();
  const [bet, setBet] = useState(0.1);
  const [currency, setCurrency] = useState(1);
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);

  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);
  const translation = useAppSelector(store => store.app.languageSettings);
  
  const handleCurrencyChange = (newCurrency: number) => {
    setCurrency(newCurrency);
  };

  const handleBetChange = (newBet: number) => {
    setBet(newBet);
  };

  const handleCreateRoom = (userIdValue: string, bet: number, betType: number, roomType: number) => {
    const data = {
      user_id: userIdValue,
      bet: bet,
      bet_type: betType,
      room_type: roomType
    };
    if (roomType === 2) {
      setMessage("This game is not available now");
      setMessageShown(true);
      setTimeout(() => {
        setMessage("");
        setMessageShown(false);
      }, 2000)
    } else {
      postNewRoomRequest(data, userIdValue)
        .then((response: any) => {
          console.log(response);
          if (response.message === 'success') {
            console.log('Room created successfully, room_id:', response.room_id);
            navigate(`/room/${response.room_id}`);
          } else if (response.message === 'not_enough_coins') {
            console.log('Insufficient funds')
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  };

  return (
    <div className={styles.game + 'scrollable'}>
      {messageShown ? (
        <div className={styles.game__notification}>
          {message}
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
                <SettingsSlider isCurrency={false} onBetChange={handleBetChange} />
                <SettingsSlider isCurrency onCurrencyChange={handleCurrencyChange} />
              </div>
            </div>
            <div className={styles.game__buttonWrapper}>
              <Button text={translation?.create_room_button} handleClick={() => handleCreateRoom(userId, bet, currency, data.id)} />
            </div>
          </div>
        </>
      )}
    </div>
  )
};

export default GameSettings;
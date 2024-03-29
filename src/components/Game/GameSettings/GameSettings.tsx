/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react';
import styles from './GameSettings.module.scss';
import Button from '../../ui/Button/Button';
import BetSlider from '../../BetSlider/Betslider';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../services/reduxHooks';
import { formatNumber } from '../../../utils/additionalFunctions';
import { postReq } from '../../../api/api';
import { userId } from '../../../api/requestData';
import { postNewRoomRequest } from '../../../api/gameApi';

interface IProps {
  data: any; // типизировать
}

const GameSettings: FC<IProps> = ({ data }) => {
  const navigate = useNavigate();
  const [bet, setBet] = useState(0.1);
  const [currency, setCurrency] = useState(1);
  // const [message, setMessage] = useState('');
  // const [messageShown, setMessageShown] = useState(false);
  console.log(data);
  console.log(bet);
  console.log(currency);
  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);

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
    postNewRoomRequest(data, userIdValue)
      .then((response: any) => {
        console.log(response);
        if (response.message === 'success') {
          console.log('Комната успешно создана:', response.room_id);
          navigate(`/room/${response.room_id}`);
        } else if (response.message === 'not_enough_coins') {
          console.log('Недостаточно средств для создания комнаты')
        }
      })
  };

  return (
    <div className={styles.game}>
      {/* {messageShown ? (
        <div className={styles.product__notification}>
          {message}
        </div>
      ) : ( */}
      <>
        <div style={{ backgroundImage: `${data?.img}` }} className={styles.game__logo} />
        <div className={styles.game__content}>
          <h3 className={styles.game__title}>{data?.name}</h3>
          <div className={styles.game__balance}>
            <p className={styles.game__text}>Ваш баланс:</p>
            <div className={styles.game__balanceWrapper}>
              <p className={styles.game__text}>💵 {userCoins && formatNumber(userCoins)}</p>
              <p className={styles.game__text}>🔰 {userTokens && formatNumber(userTokens)}</p>
            </div>
          </div>
          <div className={styles.game__menu}>
            <p className={styles.game__text}>Ставка в комнате:</p>
            <div className={styles.game__buttons}>
              <BetSlider isCurrency={false} onBetChange={handleBetChange} />
              <BetSlider isCurrency onCurrencyChange={handleCurrencyChange} />
            </div>
          </div>
          <div className={styles.game__buttonWrapper}>
            <Button text='Создать' handleClick={() => handleCreateRoom(userId, bet, currency, data.id)} />
          </div>
        </div>
      </>
      {/* ) */}
    </div>
  )
};

export default GameSettings;
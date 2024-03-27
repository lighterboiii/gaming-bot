import { FC } from 'react';
import styles from './GameSettings.module.scss';
import Button from '../../ui/Button/Button';
import BetSlider from '../../BetSlider/Betslider';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../services/reduxHooks';
import { formatNumber } from '../../../utils/additionalFunctions';

interface IProps {
  data: any;
}

const GameSettings: FC<IProps> = ({ data }) => {
  const navigate = useNavigate();
  // console.log(data);
  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);
  return (
    <div className={styles.game}>
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
            <BetSlider isPrice />
            <BetSlider isCurrency />
          </div>
        </div>
        <div className={styles.game__buttonWrapper}>
          <Button text='Создать' handleClick={() => navigate('/404')} />
        </div>
      </div>
    </div>
  )
};

export default GameSettings;
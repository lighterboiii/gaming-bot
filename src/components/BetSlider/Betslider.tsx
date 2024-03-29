/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react';
import styles from './BetSlider.module.scss';
import ChevronIcon from '../../icons/Chevron/ChevronIcon';
import { useAppSelector } from '../../services/reduxHooks';
import { postEvent } from '@tma.js/sdk';

interface IProps {
  isPrice?: boolean;
  isCurrency?: boolean;
}

const BetSlider: FC<IProps> = ({ isPrice, isCurrency }) => {
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("💵");
  const coinsBalance = useAppSelector(store => store.app.info?.coins);
  const tokensBalance = useAppSelector(store => store.app.info?.tokens)

  const increasePrice = () => {
    // postEvent('web_app_trigger_haptic_feedback', {
    //   type: 'impact',
    //   impact_style: 'soft',
    // });
    setPrice(prevPrice => prevPrice + 0.1);
  };

  const decreasePrice = () => {
    // postEvent('web_app_trigger_haptic_feedback', {
    //   type: 'impact',
    //   impact_style: 'soft',
    // });
    if (price >= 0.1) {
      setPrice(prevPrice => prevPrice - 0.1);
    }
  };

  const setCurr = () => {
    if (currency === "💵") {
      setCurrency("🔰")
    } else {
      setCurrency("💵")
    }
  };

  return (
    <div className={styles.slider}>
      <button
        onClick={isCurrency ? setCurr : decreasePrice}
        className={styles.slider__button}
      >
        <ChevronIcon position='left' />
      </button>
      <span className={styles.slider__text}>
        {isPrice && price.toFixed(1)}
        {isCurrency && currency}
      </span>
      <button
        onClick={isCurrency ? setCurr : increasePrice}
        className={styles.slider__button}
      >
        <ChevronIcon position='right' />
      </button>
    </div>
  );
};

export default BetSlider;

import { FC, useState } from 'react';
import styles from './BetSlider.module.scss';
import ChevronIcon from '../../icons/Chevron/ChevronIcon';

interface IProps {
  isPrice?: boolean;
  isCurrency?: boolean;
}

const BetSlider: FC<IProps> = ({ isPrice, isCurrency }) => {
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("💵");

  const increasePrice = () => {
    setPrice(prevPrice => prevPrice + 0.1);
  };

  const decreasePrice = () => {
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

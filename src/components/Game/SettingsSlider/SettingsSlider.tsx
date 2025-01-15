/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, FC, useEffect, useState } from 'react';

import ChevronIcon from '../../../icons/Chevron/ChevronIcon';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';

import styles from './SettingsSlider.module.scss';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  betValue?: any;
  isCurrency?: boolean;
  onBetChange?: (newBet: number) => void;
  onCurrencyChange?: (newCurrency: number) => void;
  onInputChange?: (bet: string) => void;
}

const SettingsSlider: FC<IProps> = ({
  isCurrency = false,
  onBetChange = () => { },
  onCurrencyChange = () => { },
  onInputChange,
}) => {
  const [bet, setBet] = useState('0');
  const [currency, setCurrency] = useState(1);

  const increaseBet = () => {
    triggerHapticFeedback('impact', 'soft');
    setBet(prevBet => {
      const newBet = (parseFloat(prevBet) + 0.1).toFixed(1);
      const numericBet = parseFloat(newBet);
      onBetChange(numericBet);
      onInputChange && onInputChange(newBet);
      return newBet;
    });
  };

  const decreaseBet = () => {
    triggerHapticFeedback('impact', 'soft');
    setBet(prevBet => {
      const currentBet = parseFloat(prevBet);
      if (currentBet > 0) {
        const newBet = currentBet === 0.1 ? '0' : (currentBet - 0.1).toFixed(1);
        const numericBet = parseFloat(newBet);
        onBetChange(numericBet);
        onInputChange && onInputChange(newBet);
        return newBet;
      }
      return prevBet;
    });
  };

  const toggleCurrency = () => {
    const newCurrency = currency === 3 ? 1 : 3;
    triggerHapticFeedback('impact', 'soft');
    setCurrency(newCurrency);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBet(value);

    const newBetValue = parseFloat(value);
    if (!isNaN(newBetValue)) {
      onBetChange(newBetValue);
    }

    onInputChange && onInputChange(value);
  };

  useEffect(() => {
    onCurrencyChange(currency);
  }, [currency, onCurrencyChange]);

  useEffect(() => {
    const numericBet = parseFloat(bet);
    if (!isNaN(numericBet)) {
      onBetChange(numericBet);
      onInputChange && onInputChange(bet);
    }
  }, [bet, onBetChange, onInputChange]);

  return (
    <div className={styles.slider}>
      <button
        onClick={isCurrency ? toggleCurrency : decreaseBet}
        className={styles.slider__button}
      >
        <ChevronIcon position='left' />
      </button>
      {isCurrency ? (
        <span className={styles.slider__text}>
          {currency === 1 ? '💵' : '🔰'}
        </span>
      ) : (
        <input
          type="number"
          value={bet}
          className={styles.slider__input}
          onChange={handleInputChange}
        />
      )}

      <button
        onClick={isCurrency ? toggleCurrency : increaseBet}
        className={styles.slider__button}
      >
        <ChevronIcon position='right' />
      </button>
    </div>
  );
};

export default SettingsSlider;

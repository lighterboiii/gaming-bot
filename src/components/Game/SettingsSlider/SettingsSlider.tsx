import { FC, useEffect, useState, useRef } from 'react';

import ChevronIcon from '../../../icons/Chevron/ChevronIcon';
import { MONEY_EMOJI, SHIELD_EMOJI } from '../../../utils/constants';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';

import styles from './SettingsSlider.module.scss';

interface IProps {
  betValue?: string;
  isCurrency?: boolean;
  onBetChange?: (newBet: number) => void;
  onCurrencyChange?: (newCurrency: number) => void;
  onInputChange?: (bet: string) => void;
  onKeyboardShow?: (show: boolean) => void;
  currValue?: number | string;
  initialCurrency?: number;
}

const SettingsSlider: FC<IProps> = ({
  currValue,
  betValue = '1.0',
  isCurrency = false,
  onBetChange = () => { },
  onCurrencyChange = () => { },
  onInputChange,
  onKeyboardShow = () => { },
  initialCurrency = 1,
}) => {
  const [currency, setCurrency] = useState(initialCurrency);
  const inputRef = useRef<HTMLInputElement>(null);

  const increaseBet = () => {
    triggerHapticFeedback('impact', 'soft');
    const currentBet = parseFloat(betValue);
    const newBet = (currentBet + 0.1).toFixed(1);
    const numericBet = parseFloat(newBet);
    onBetChange(numericBet);
    onInputChange && onInputChange(newBet);
  };

  const decreaseBet = () => {
    triggerHapticFeedback('impact', 'soft');
    const currentBet = parseFloat(betValue);
    if (currentBet > 0) {
      const newBet = currentBet === 0.1 ? '0' : (currentBet - 0.1).toFixed(1);
      const numericBet = parseFloat(newBet);
      onBetChange(numericBet);
      onInputChange && onInputChange(newBet);
    }
  };

  const toggleCurrency = () => {
    const newCurrency = currency === 3 ? 1 : 3;
    triggerHapticFeedback('impact', 'soft');
    setCurrency(newCurrency);
  };

  const handleInputFocus = () => {
    if (!isCurrency) {
      onKeyboardShow(true);
    }
  };

  useEffect(() => {
    onCurrencyChange(currency);
  }, [currency, onCurrencyChange]);

  return (
    <div className={styles.slider}>
      {/* {isCurrency &&  */}
      <button
        onClick={isCurrency ? toggleCurrency : decreaseBet}
        className={styles.slider__button}
      >
        <ChevronIcon position='left' />
      </button>
      {/* } */}
      {isCurrency ? (
        <span className={styles.slider__text}>
          {currency === 1 ? `${MONEY_EMOJI}` : `${SHIELD_EMOJI}`}
        </span>
      ) : (
        <input
          ref={inputRef}
          type="text"
          inputMode="none"
          value={betValue}
          className={styles.slider__input}
          onFocus={handleInputFocus}
          readOnly
        />
      )}
      {/* {isCurrency && */}
       <button
        onClick={isCurrency ? toggleCurrency : increaseBet}
        className={styles.slider__button}
      >
          <ChevronIcon position='right' />
        </button>
      {/* } */}
    </div>
  );
};

export default SettingsSlider;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useRef } from 'react';

import ChevronIcon from '../../../icons/Chevron/ChevronIcon';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';
// import NumericKeyboard from '../NumericKeyboard/NumericKeyboard';

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
  const [bet, setBet] = useState('1.0');
  const [keyboardValue, setKeyboardValue] = useState('1.0');
  const [currency, setCurrency] = useState(1);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeKeyboard = () => {
    setShowKeyboard(false);
  };

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

  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setKeyboardValue(bet);
    setShowKeyboard(true);
  };

  const handleConfirm = () => {
    const numericBet = parseFloat(keyboardValue);
    if (!isNaN(numericBet)) {
      setBet(keyboardValue);
      onBetChange(numericBet);
      onInputChange && onInputChange(keyboardValue);
    }
    closeKeyboard();
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
    <>
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
            ref={inputRef}
            type="text"
            inputMode="none"
            value={bet}
            className={styles.slider__input}
            onFocus={handleInputFocus}
            readOnly
          />
        )}

        <button
          onClick={isCurrency ? toggleCurrency : increaseBet}
          className={styles.slider__button}
        >
          <ChevronIcon position='right' />
        </button>
      </div>

      {/* <NumericKeyboard
        isVisible={showKeyboard}
        value={keyboardValue}
        onClose={closeKeyboard}
        onChange={setKeyboardValue}
        onConfirm={handleConfirm}
      /> */}
    </>
  );
};

export default SettingsSlider;

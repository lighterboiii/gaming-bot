/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, FC, useEffect, useState, useRef, TouchEvent } from 'react';

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
  const [bet, setBet] = useState('1.0');
  const [currency, setCurrency] = useState(1);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);

  const closeKeyboard = () => {
    setShowKeyboard(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        closeKeyboard();
      }
    };

    // Handle escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeKeyboard();
      }
    };

    if (showKeyboard) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showKeyboard]);

  // Handle swipe down
  const handleTouchStart = (e: TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touchEnd = e.touches[0].clientY;
    const diff = touchEnd - touchStartRef.current;

    if (diff > 50) { // If swipe down is more than 50px
      closeKeyboard();
    }
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
      inputRef.current.blur(); // Prevent default keyboard
    }
    setShowKeyboard(true);
  };

  const handleKeyPress = (key: string) => {
    triggerHapticFeedback('impact', 'soft');
    if (key === 'delete') {
      setBet(prevBet => {
        const newBet = prevBet.slice(0, -1) || '0';
        const numericBet = parseFloat(newBet);
        onBetChange(numericBet);
        onInputChange && onInputChange(newBet);
        return newBet;
      });
    } else if (key === 'done') {
      closeKeyboard();
    } else {
      setBet(prevBet => {
        let newBet = prevBet;
        // Handle decimal point
        if (key === '.' && !prevBet.includes('.')) {
          newBet = prevBet + key;
        } 
        // Handle numbers
        else if (key !== '.') {
          if (prevBet === '0') {
            newBet = key;
          } else {
            newBet = prevBet + key;
          }
        }
        
        const numericBet = parseFloat(newBet);
        if (!isNaN(numericBet)) {
          onBetChange(numericBet);
          onInputChange && onInputChange(newBet);
        }
        return newBet;
      });
    }
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

      <div 
        ref={keyboardRef}
        className={`${styles.keyboard} ${showKeyboard ? styles['keyboard--visible'] : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className={styles.keyboard__grid}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'].map((key) => (
            <button
              key={key}
              className={`${styles.keyboard__key} ${key === 'delete' ? styles['keyboard__key--action'] : ''}`}
              onClick={() => handleKeyPress(key)}
            >
              {key === 'delete' ? '⌫' : key}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SettingsSlider;

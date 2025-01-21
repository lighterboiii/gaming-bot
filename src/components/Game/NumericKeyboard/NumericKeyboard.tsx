import { FC, useEffect, useRef, TouchEvent } from 'react';

import { useAppSelector } from 'services/reduxHooks';
import { MONEY_EMOJI, SHIELD_EMOJI } from 'utils/constants';

import { formatNumber } from '../../../utils/additionalFunctions';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';

import styles from './NumericKeyboard.module.scss';

interface IProps {
  isVisible: boolean;
  value: string;
  onClose: () => void;
  onChange: (value: string) => void;
  onConfirm: () => void;
}

const NumericKeyboard: FC<IProps> = ({
  isVisible,
  value,
  onClose,
  onChange,
  onConfirm,
}) => {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);
  const translation = useAppSelector(store => store.app.languageSettings);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible, onClose]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touchEnd = e.touches[0].clientY;
    const diff = touchEnd - touchStartRef.current;

    if (diff > 50) {
      onClose();
    }
  };

  const handleKeyPress = (key: string) => {
    triggerHapticFeedback('impact', 'soft');
    if (key === 'delete') {
      onChange(value.slice(0, -1) || '0');
    } else {
      let newValue = value;
      if (key === '.' && !value.includes('.')) {
        newValue = value + key;
      } 
      else if (key !== '.') {
        if (value === '0') {
          newValue = key;
        } else {
          newValue = value + key;
        }
      }
      onChange(newValue);
    }
  };

  return (
    <div 
      ref={keyboardRef}
      className={`${styles.keyboard} ${isVisible ? styles['keyboard--visible'] : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className={styles.keyboard__balance}>
        <div className={styles['keyboard__balance-item']}>
          <span>{MONEY_EMOJI} </span>
          <span>{userCoins !== undefined ? formatNumber(userCoins) : 0}</span>
        </div>
        <div className={styles['keyboard__balance-item']}>
          <span>{SHIELD_EMOJI} </span>
          <span>{userTokens !== undefined ? formatNumber(userTokens) : 0}</span>
        </div>
      </div>

      <div className={styles.keyboard__header}>
        <div className={styles['keyboard__input-wrapper']}>
          <input
            type="text"
            inputMode="none"
            value={value}
            className={styles.keyboard__input}
            readOnly
          />
        </div>
      </div>

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

      <button 
        className={styles.keyboard__confirmButton}
        onClick={onConfirm}
      >
        {translation?.confirm_text}
      </button>
    </div>
  );
};

export default NumericKeyboard; 
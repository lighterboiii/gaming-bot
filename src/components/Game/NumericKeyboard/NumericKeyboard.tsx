/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, TouchEvent, useState } from 'react';

import ChevronIcon from 'icons/Chevron/ChevronIcon';

import { useAppSelector } from '../../../services/reduxHooks';
import { formatNumber } from '../../../utils/additionalFunctions';
import { MONEY_EMOJI, SHIELD_EMOJI } from '../../../utils/constants';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';

import styles from './NumericKeyboard.module.scss';

interface IProps {
  onClose: () => void;
  onConfirm: (value: string) => void;
  onBack: () => void;
  initialValue?: string;
}

const NumericKeyboard: FC<IProps> = ({
  onClose,
  onConfirm,
  onBack,
  initialValue = ''
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const userTokens = useAppSelector(store => store.app.info?.tokens);
  const userCoins = useAppSelector(store => store.app.info?.coins);
  const translation = useAppSelector(store => store.app.languageSettings);

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
      setInputValue(prev => prev.slice(0, -1) || '');
      return;
    }

    if (key === '.') {
      if (!inputValue.includes('.')) {
        setInputValue(prev => prev === '' ? '0.' : prev + '.');
      }
      return;
    }

    if (inputValue.includes('.')) {
      const [, decimal] = inputValue.split('.');
      if (decimal && decimal.length >= 1) {
        return;
      }
    }

    if (inputValue.length > 7) {
      return;
    }

    if (inputValue === '') {
      setInputValue(key);
      return;
    }

    setInputValue(prev => prev + key);
  };

  const handleConfirm = () => {
    onConfirm(inputValue);
  };

  return (
    <div 
      ref={keyboardRef}
      className={styles.keyboard}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className={styles.keyboard__header}>
        <button 
          onClick={onBack}
          className={styles.keyboard__backButton}
        >
          <ChevronIcon position='left' />
        </button>
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
      </div>

      <div className={styles.keyboard__input}>
        <div className={styles['keyboard__input-wrapper']}>
          <input
            type="text"
            inputMode="none"
            value={inputValue}
            placeholder={translation?.insert_bet || "Введите ставку"}
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
        onClick={handleConfirm}
      >
        {translation?.confirm_text}
      </button>
    </div>
  );
};

export default NumericKeyboard; 
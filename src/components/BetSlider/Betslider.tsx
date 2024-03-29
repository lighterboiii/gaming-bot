/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, FC, useState } from 'react';
import styles from './BetSlider.module.scss';
import ChevronIcon from '../../icons/Chevron/ChevronIcon';
import { useAppSelector } from '../../services/reduxHooks';
import { postEvent } from '@tma.js/sdk';
// import { postEvent } from '@tma.js/sdk'; 

interface IProps {
  isCurrency?: boolean;
  onBetChange?: (newBet: number) => void;
  onCurrencyChange?: (newCurrency: number) => void;
}

const BetSlider: FC<IProps> = ({
  isCurrency = false,
  onBetChange = (newBet: number) => { },
  onCurrencyChange = (newCurrency: number) => { },
}) => {
  const [bet, setBet] = useState('0');
  const [currency, setCurrency] = useState(1);

  const coinsBalance = useAppSelector(store => store.app.info?.coins);
  const tokensBalance = useAppSelector(store => store.app.info?.tokens);

  const increaseBet = () => {
    postEvent('web_app_trigger_haptic_feedback', {type: 'impact', impact_style: 'soft'});
    setBet(prevBet => {
      const newBet = (parseFloat(prevBet) + 0.1).toFixed(1);
      onBetChange(parseFloat(newBet));
      return newBet;
    });
  };

  const decreaseBet = () => {
    postEvent('web_app_trigger_haptic_feedback', {
      type: 'impact', impact_style: 'soft'
    });
    setBet(prevBet => {
      const currentBet = parseFloat(prevBet);
      if (currentBet > 0.1) {
        const newBet = (currentBet - 0.1).toFixed(1);
        onBetChange(parseFloat(newBet));
        return newBet;
      }
      return prevBet;
    });
  };

  const toggleCurrency = () => {
    const newCurrency = currency === 3 ? 1 : 3;
    setCurrency(newCurrency);
    onCurrencyChange(newCurrency);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBet(value);

    const newBetValue = parseFloat(value);
    if (!isNaN(newBetValue)) {
      onBetChange(newBetValue);
    }
  };



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
          // step="0.1"
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

export default BetSlider;
/* eslint-disable @typescript-eslint/no-unused-vars */
// Importing necessary React and style modules
import { FC, useState } from 'react';
import styles from './BetSlider.module.scss';
import ChevronIcon from '../../icons/Chevron/ChevronIcon';
import { useAppSelector } from '../../services/reduxHooks';
// Uncomment and correct if needed for your haptic feedback implementation
// import { postEvent } from '@tma.js/sdk'; 

interface IProps {
  isCurrency?: boolean;
  onBetChange?: (newBet: number) => void;
  onCurrencyChange?: (newCurrency: number) => void;
}

const BetSlider: FC<IProps> = ({
  isCurrency = false,
  onBetChange = (newBet: number) => {}, 
  onCurrencyChange = (newCurrency: number) => {},
}) => {
  const [bet, setBet] = useState(0.1);
  const [currency, setCurrency] = useState(1);

  const coinsBalance = useAppSelector(store => store.app.info?.coins);
  const tokensBalance = useAppSelector(store => store.app.info?.tokens);

  const increaseBet = () => {
    // postEvent('web_app_trigger_haptic_feedback', {type: 'impact', impact_style: 'soft'});
    setBet(prevBet => {
      const newBet = prevBet + 0.1;
      onBetChange(newBet);
      return newBet;
    });
  };

  const decreaseBet = () => {
    // postEvent('web_app_trigger_haptic_feedback', {type: 'impact', impact_style: 'soft'});
    if (bet > 0.1) {
      setBet(prevBet => {
        const newBet = prevBet - 0.1;
        onBetChange(newBet);
        return newBet;
      });
    }
  };

  const toggleCurrency = () => {
    const newCurrency = currency === 3 ? 1 : 3;
    setCurrency(newCurrency);
    onCurrencyChange(newCurrency);
  };

  return (
    <div className={styles.slider}>
      <button
        onClick={isCurrency ? toggleCurrency : decreaseBet}
        className={styles.slider__button}
      >
        <ChevronIcon position='left' />
      </button>
      <span className={styles.slider__text}>
      {isCurrency ? (currency === 1 ? '💵' : '🔰') : bet.toFixed(1)}
      </span>
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
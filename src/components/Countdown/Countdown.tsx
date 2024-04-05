/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, FC } from 'react';
import styles from './Countdown.module.scss';

interface IProps {
  initialSeconds: number;
}

const Countdown: FC<IProps> = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateTime = () => {
    setSeconds(prevSeconds => prevSeconds - 1);
  };

  return (
    <span className={styles.countdown}>{seconds}</span>
  );
};

export default Countdown;

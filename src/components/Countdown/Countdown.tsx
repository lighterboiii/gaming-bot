/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import styles from './Countdown.module.scss';

const Countdown = () => {
  const randomDays = Math.floor(Math.random() * 7) + 1;
  const [time, setTime] = useState({ days: randomDays, hours: 0, minutes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateTime = () => {
    let { days, hours, minutes } = time;

    let totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60;
    totalSeconds--;

    days = Math.floor(totalSeconds / (24 * 60 * 60));
    hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

    setTime({ days, hours, minutes });
  };

  return (
    <span className={styles.countdown}>{time.days}д {time.hours}ч {time.minutes}м</span>
  );
};

export default Countdown;

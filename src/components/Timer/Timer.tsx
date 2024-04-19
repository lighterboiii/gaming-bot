import { useState, useEffect } from 'react';
import styles from './Timer.module.scss';

interface Time {
  days: number;
  hours: number;
  minutes: number;
}

const Timer = () => {
  const initialTime: Time = { days: 7, hours: 0, minutes: 0 };
  const [time, setTime] = useState<Time>(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => updateTime(prevTime));
    }, 60000);
  
    return () => clearInterval(interval);
  }, []);
  
  const updateTime = (prevTime: Time): Time => {
    let totalMinutes = prevTime.days * 24 * 60 + prevTime.hours * 60 + prevTime.minutes - 1;
  
    if (totalMinutes < 0) {
      console.log('Таймер завершил отсчет');
      return { days: 0, hours: 0, minutes: 0 };
    } else {
      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
      const minutes = totalMinutes % 60;
      return { days, hours, minutes };
    }
  };

  useEffect(() => {
    localStorage.setItem('timer', JSON.stringify(time));
  }, [time]);


  return (
    <span className={styles.timer}>{time.days}д {time.hours}ч {time.minutes}м</span>
  );
};

export default Timer;

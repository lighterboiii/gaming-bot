import { FC, useEffect, useState } from "react";

import styles from './ProgressBar.module.scss';

interface IProps {
  progress?: number;
}

const CircularProgressBar: FC<IProps> = ({ progress = 0 }) => {
  const [offset, setOffset] = useState({ x: 50, y: 5 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    if (progress !== 0) {
      const limitedProgress = Math.max(0, Math.min(100, progress));
      const angle = ((limitedProgress * 3.6) - 90) * (Math.PI / 180);
      const x = 50 + 45 * Math.cos(angle);
      const y = 50 + 45 * Math.sin(angle);

      setIsAnimating(true);
      
      // Быстрое изменение чисел в начале
      const fastInterval = setInterval(() => {
        setRandomNumber(prev => {
          const variation = Math.floor(Math.random() * 20) - 10;
          const newValue = prev + variation;
          return Math.min(100, Math.max(0, newValue));
        });
      }, 25);

      // Замедление в конце анимации
      setTimeout(() => {
        clearInterval(fastInterval);
        const slowInterval = setInterval(() => {
          setRandomNumber(prev => {
            const diff = progress - prev;
            const step = diff / 10;
            return Math.round(prev + step);
          });
        }, 100);

        setTimeout(() => {
          clearInterval(slowInterval);
          setRandomNumber(progress);
          setIsAnimating(false);
        }, 500);
      }, 3500);

      setOffset({ x, y });

      return () => {
        clearInterval(fastInterval);
      };
    } else {
      setOffset({ x: 50, y: 5 });
      setRandomNumber(0);
    }
  }, [progress]);

  return (
    <div className={styles.bar__wrapper}>
      <svg className={styles.bar} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <circle className={styles.bar__innerCircle} cx="50" cy="50" r="45"></circle>
        <circle className={styles.bar__outerCircle} cx="50" cy="50" r="45"></circle>
        <circle
          className={`${styles.bar__progressPoint} ${isAnimating ? styles.bar__animated : ''}`}
          cx={offset.x}
          cy={offset.y}
          r="10"
        ></circle>
      </svg>
      <div className={styles.bar__textContainer}>
        <span className={`${styles.bar__text} ${isAnimating ? styles.bar__textAnimated : ''}`}>
          {isAnimating ? randomNumber : progress}
        </span>
      </div>
    </div>
  );
};

export default CircularProgressBar;

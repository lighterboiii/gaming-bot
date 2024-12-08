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
      const interval = setInterval(() => {
        setRandomNumber(prev => {
          const variation = Math.floor(Math.random() * 20) - 10;
          const newValue = prev + variation;
          return Math.min(100, Math.max(0, newValue));
        });
      }, 25);

      const animationTimeout = setTimeout(() => {
        setOffset({ x, y });
        setIsAnimating(false);
        clearInterval(interval);
      }, 4000);

      return () => {
        clearTimeout(animationTimeout);
        clearInterval(interval);
      };
    } else {
      setOffset({ x: 50, y: 5 });
    }
  }, [progress]);

  return (
    <svg className={styles.bar} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <circle className={styles.bar__innerCircle} cx="50" cy="50" r="45"></circle>
      <circle className={styles.bar__outerCircle} cx="50" cy="50" r="45"></circle>
      <circle
        className={`${styles.bar__progressPoint} ${isAnimating ? styles.bar__animated : ''}`}
        cx={offset.x}
        cy={offset.y}
        r="10"
      ></circle>
      <foreignObject x="20" y="35" width="60" height="30">
        <div className={styles.bar__textContainer}>
          <text
            className={`${styles.bar__text} ${isAnimating ? styles.bar__textAnimated : ''}`}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {isAnimating ? randomNumber : progress}
          </text>
        </div>
      </foreignObject>
    </svg>
  );
};

export default CircularProgressBar;

import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

import styles from './ProgressBar.module.scss';

interface IProps {
  progress: number;
}

const CircularProgressBar: FC<IProps> = ({ progress }) => {
  const [offset, setOffset] = useState({ x: 50, y: 5 });
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (progress !== 0) {
      const limitedProgress = Math.max(0, Math.min(100, progress));
      const angle = ((limitedProgress * 3.6) - 90) * (Math.PI / 180);
      const x = 50 + 45 * Math.cos(angle);
      const y = 50 + 45 * Math.sin(angle);

      setIsAnimating(true);
      const animationTimeout = setTimeout(() => {
        setOffset({ x, y });
        setIsAnimating(false);
      }, 4000);

      return () => clearTimeout(animationTimeout);
    }
  }, [progress]);

  return (
    <svg className={styles.bar}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet">
      <circle className={styles.bar__innerCircle}
        cx="50"
        cy="50"
        r="45">
      </circle>
      <circle className={styles.bar__outerCircle}
        cx="50"
        cy="50"
        r="45">
      </circle>
      <circle
        className={`${styles.bar__progressPoint} ${isAnimating ? styles.bar__animated : ''}`}
        cx={offset.x}
        cy={offset.y}
        r="10"
      >
      </circle>
      <motion.text
        x="50%"
        y="53%"
        className={`${styles.bar__text} ${isAnimating ? styles.bar__textAnimated : ''}`}
        dominantBaseline="middle"
        textAnchor="middle"
        // initial={{ translateY: '0%' }}
        // animate={{ translateY: '-100%' }}
        transition={{ duration: 4, ease: 'linear' }}
      >
        {progress}
      </motion.text>
    </svg>
  );
};

export default CircularProgressBar;

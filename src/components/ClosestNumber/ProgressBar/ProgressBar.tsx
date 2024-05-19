import { useState, useEffect, FC } from "react";
import styles from './ProgressBar.module.scss';

interface IProps {
  progress: number;
}

const CircularProgressBar: FC<IProps> = ({ progress }) => {
  const [offset, setOffset] = useState({ x: 0, y: 95 });

  useEffect(() => {
    const limitedProgress = Math.max(0, Math.min(100, progress));
    const angle = ((limitedProgress * 3.6) + 90) * (Math.PI / 180);
    const x = 50 + 45 * Math.cos(angle);
    const y = 50 + 45 * Math.sin(angle);
    setOffset({ x, y });
  }, [progress]);
  
  return (
    <svg className={styles.bar} viewBox="0 0 100 100">
      <circle className={styles.bar__innerCircle} cx="50" cy="50" r="45"></circle>
      <circle className={styles.bar__outerCircle} cx="50" cy="50" r="45"></circle>
      <circle className={styles.bar__progressPoint} cx={offset.x} cy={offset.y} r="10"></circle>
    </svg>
  );
};

export default CircularProgressBar;

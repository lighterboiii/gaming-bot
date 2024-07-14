import { FC } from 'react';

import styles from './Timer.module.scss';

interface IProps {
  days: string;
  hours: string;
  minutes: string;
}

const Timer: FC<IProps> = ({ days, hours, minutes }) => {
  return (
    <span className={styles.timer}>{days}д {hours}ч {minutes}м</span>
  );
};

export default Timer;

import { FC, useEffect, useState } from 'react';

import styles from './Timer.module.scss';

interface IProps {
  days: number;
  hours: number;
  minutes: number;
}

const Timer: FC<IProps> = ({ days, hours, minutes }) => {
  return (
    <span className={styles.timer}>{days}д {hours}ч {minutes}м</span>
  );
};

export default Timer;

import { FC } from "react";

import { useAppSelector } from "services/reduxHooks";

import styles from "./Timer.module.scss";

interface IProps {
  days: string;
  hours: string;
  minutes: string;
}

const Timer: FC<IProps> = ({ days, hours, minutes }) => {
  const translation = useAppSelector((store) => store.app.languageSettings);
  return (
    <p className={styles.timer}>
      <span className={styles.timer__number}>
        {days}
        {translation.leaderboard_time_days}
      </span>
      <span className={styles.timer__number}>
        {hours}
        {translation.leaderboard_time_hours}
      </span>
      <span className={styles.timer__number}>
        {minutes}
        {translation.leaderboard_time_minutes}
      </span>
    </p>
  );
};

export default Timer;

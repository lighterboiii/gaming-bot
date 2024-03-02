import { FC } from "react";
import styles from './Leader.module.scss';

interface IProps {
  leader: any;
}

const Leader: FC<IProps> = ({ leader }) => {

  return (
    <div className={`${styles.leader} ${leader.id % 2 === 0 ? styles.darkBackground : ''}`}>
      <div className={styles.leader__container}>
        <img className={styles.leader__avatar} src={leader.img} alt="leader_avatar" />
        <h3 className={styles.leader__number}>{leader.id}</h3>
        <p className={styles.leader__text}>{leader.username}</p>
      </div>
      <div className={styles.leader__gainWrapper}>
        <p className={styles.leader__text}>{leader.gain}</p>
      </div>
    </div>
  )
};

export default Leader;
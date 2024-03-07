import { FC } from "react";
import styles from './Leader.module.scss';
import { getRandomSkinAndMask } from "../../utils/getSkinAndMask";

interface IProps {
  leader: any;
}

const Leader: FC<IProps> = ({ leader }) => {
  const { skin, mask } = getRandomSkinAndMask();

  return (
    <div className={`${styles.leader} ${leader.id % 2 === 0 ? styles.darkBackground : ''}`}>
      <div className={styles.leader__container}>
        <div className={styles.leader__avatarWrapper}>
          <div className={styles.leader__avatarBackground} style={{ backgroundImage: `url(${skin})` }}></div>
          <img className={styles.leader__avatar} src={leader.img} alt="leader_avatar" style={{ maskImage: `url(${mask})` }} />
        </div>
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
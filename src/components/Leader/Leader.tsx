import { FC } from "react";
import styles from './Leader.module.scss';
import { getRandomSkinAndMask } from "../../utils/getSkinAndMask";

interface IProps {
  leader: any;
  index: number;
  length: number;
}

const Leader: FC<IProps> = ({ leader, index, length }) => {
  const { skin, mask } = getRandomSkinAndMask();
  console.log(length);
  return (
    <div className={`${styles.leader} ${index === 0 ? styles.roundedBorders : ''} ${index === length - 2 ? styles.lowRoundedBorders : ''}`}>
      <div className={styles.leader__avatarWrapper}>
        <div className={styles.leader__avatarBackground} style={{ backgroundImage: `url(${skin})` }}></div>
        <img className={styles.leader__avatar} src={leader.img} alt="leader_avatar" style={{ maskImage: `url(${mask})` }} />
      </div>
      <div className={styles.leader__container}>
        <h3 className={styles.leader__number}>{leader.id}</h3>
        <p className={styles.leader__text}>{leader.username}</p>
        <div className={styles.leader__gainWrapper}>
          <p className={styles.leader__text}>{leader.gain}</p>
        </div>
      </div>
    </div>
  )
};

export default Leader;
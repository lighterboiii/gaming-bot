import { FC } from "react";
import styles from './UserContainer.module.scss';
import { getRandomSkinAndMask } from "../../../utils/getSkinAndMask";

interface IProps {
  user: any;
  index: number;
  length: number;
  darkBackground?: boolean;
}

const UserContainer: FC<IProps> = ({ user, index, length, darkBackground = false }) => {
  const { skin, mask } = getRandomSkinAndMask();
  console.log(user);
  return (
    <div
      className={`${styles.leader} ${index === 0 ? styles.roundedBorders : ''} ${index === length - 2 ? styles.lowRoundedBorders : ''}`}
      style={{ backgroundColor: darkBackground ? '#ac1a44' : '#d51845' }}
    >
      <div className={styles.leader__avatarWrapper}>
        <div className={styles.leader__avatarBackground} style={{ backgroundImage: `url(${skin})` }}></div>
        <img className={styles.leader__avatar}
          src={user.avatar}
          alt="leader_avatar"
          style={{ maskImage: `url(${mask})` }}
        />
      </div>
      <div className={styles.leader__container}>
        <h3 className={styles.leader__number}>{index + 1}</h3>
        <p className={styles.leader__text}>{user.public_name}</p>
        <div className={styles.leader__gainWrapper}>
          <p className={styles.leader__textCoins}>+ {user.coins}</p>
        </div>
      </div>
    </div>
  )
};

export default UserContainer;
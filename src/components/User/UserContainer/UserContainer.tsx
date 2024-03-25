import { FC } from "react";
import styles from './UserContainer.module.scss';
import useTelegram from "../../../hooks/useTelegram";

interface IProps {
  member: any;
  index: number;
  length: number;
  darkBackground?: boolean;
}

const UserContainer: FC<IProps> = ({ member, index, length, darkBackground = false }) => {
  const { user } = useTelegram();
  // const isUser = user?.id === member?.id;
  return (
    <div
      className={`${styles.leader} ${index === 0 ? styles.roundedBorders : ''} ${index === length - 2 ? styles.lowRoundedBorders : ''}`}
      style={{ backgroundColor: darkBackground ? '#ac1a44' : '#d51845' }}
    >
      <div className={styles.leader__avatarWrapper}>
        <div className={styles.leader__avatarBackground} style={{ backgroundImage: `url(${member.item_pic})` }}></div>
        <img className={styles.leader__avatar}
          src={member.avatar}
          alt="leader_avatar"
          style={{ maskImage: `url(${member.item_mask})` }}
        />
      </div>
      <div className={styles.leader__container}>
        <h3 className={styles.leader__number}>{index + 2}</h3>
        <p className={styles.leader__text}>{member.public_name}</p>
        <div className={styles.leader__gainWrapper}>
          <p className={styles.leader__textCoins}>+💵 {member.coins}</p>
        </div>
      </div>
    </div>
  )
};

export default UserContainer;
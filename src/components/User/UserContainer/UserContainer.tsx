/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './UserContainer.module.scss';
import useTelegram from "../../../hooks/useTelegram";
import { userId } from "../../../api/requestData";
import { IMember } from "../../../utils/types/memberTypes";
import UserAvatar from "../UserAvatar/UserAvatar";
import { formatNumber } from "../../../utils/additionalFunctions";

interface IProps {
  member: IMember;
  index: number;
  length: number;
  darkBackground?: boolean;
}

const UserContainer: FC<IProps> = ({ member, index, length, darkBackground = false }) => {
  const { user } = useTelegram();
  const userId = user?.id;
  const isUser = Number(userId) === member?.user_id;
  
  return (
    <div
      className={`${styles.userContainer} ${index === 0 ? styles.roundedBorders : ''} ${index === length - 2 ? styles.lowRoundedBorders : ''}`}
      style={{ backgroundColor: isUser ? '#FFF' : (darkBackground ? '#ac1a44' : '#d51845') }}
    >
      <div className={styles.userContainer__avatarWrapper}>
        <UserAvatar avatar={member.avatar} item={member}  />
      </div>
      <div className={styles.userContainer__container}>
        <h3 className={styles.userContainer__number}
          style={{ color: isUser ? "#d51845" : "" }}
        >
          {index + 2}
        </h3>
        <p className={styles.userContainer__text}
          style={{ color: isUser ? "#d51845" : "" }}
        >
          {member.public_name}
        </p>
        <div className={styles.userContainer__gainWrapper}>
          <p className={styles.userContainer__textCoins}
            style={{ color: isUser ? "#d51845" : "" }}
          >
            +💵 {formatNumber(member.coins)}
          </p>
        </div>
      </div>
    </div>
  )
};

export default UserContainer;
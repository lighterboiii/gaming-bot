/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";

import { userId } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";
import FriendsIcon from "../../../icons/Friends/FriendsIcon";
import { formatNumberSecond } from "../../../utils/additionalFunctions";
import { IMember } from "../../../utils/types/memberTypes";
import UserAvatar from "../../User/UserAvatar/UserAvatar";

import styles from './UserContainer.module.scss';

interface IProps {
  member: IMember;
  index: number;
  length: number;
  darkBackground?: boolean;
  leaderBoardType?: string;
}

const UserContainer: FC<IProps> = ({
  member,
  index,
  length,
  darkBackground = false,
  leaderBoardType
}) => {
  const { user } = useTelegram();
  // const userId = user?.id;
  const isUser = Number(userId) === member?.user_id;

  return (
    <div
      className={`${styles.userContainer} 
      ${index === 0 ? styles.roundedBorders : ''} ${index === length - 2 ? styles.lowRoundedBorders : ''}`}
      style={{ backgroundColor: isUser ? '#FFF' : (darkBackground ? '#ac1a44' : '#d51845') }}
    >
      <div className={styles.userContainer__avatarWrapper}>
        <UserAvatar avatar={member.avatar}
          item={member} />
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
            {!leaderBoardType && `+ 💵 ${formatNumberSecond(member.coins)}`}
            {leaderBoardType === 'spendtokens' && `- 🔰 ${formatNumberSecond(member.coins)}`}
            {leaderBoardType === 'spendcoins' && `- 💵 ${formatNumberSecond(member.coins)}`}
            {leaderBoardType === 'coins' && `+ 💵 ${formatNumberSecond(member.coins)}`}
            {leaderBoardType === 'tokens' && `+ 🔰 ${formatNumberSecond(member.coins)}`}
            {leaderBoardType === 'friends' && (
              <>
                + {member.coins} <FriendsIcon width={16}
                  height={16} />
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
};

export default UserContainer;

import { FC } from "react";

import { getUserId } from "utils/userConfig";

import FriendsIcon from "../../../icons/Friends/FriendsIcon";
import { formatNumber, formatToInt } from "../../../utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "../../../utils/constants";
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
  const userId = getUserId();
  const isUser = Number(userId) === member?.user_id;
  
  return (
    <div
      className={`${styles.userContainer}`} 
      // ${index === -1 ? styles.roundedBorders : ''} ${index === length - 3 ? styles.lowRoundedBorders : ''}} 
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
            {!leaderBoardType && `+ ${MONEY_EMOJI} ${formatNumber(member.coins)}`}
            {leaderBoardType === 'spendtokens' && `- ${SHIELD_EMOJI} ${formatNumber(member.coins)}`}
            {leaderBoardType === 'spendcoins' && `- ${MONEY_EMOJI} ${formatNumber(member.coins)}`}
            {leaderBoardType === 'coins' && `+ ${MONEY_EMOJI} ${formatNumber(member.coins)}`}
            {leaderBoardType === 'tokens' && `+ ${SHIELD_EMOJI} ${formatNumber(member.coins)}`}
            {leaderBoardType === 'friends' && (
              <>
                + {formatToInt(member.coins)} 
                <FriendsIcon width={16} height={16} />
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
};

export default UserContainer;

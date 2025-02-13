import { FC } from "react";

import { IPropsForClosestNumberComponent, IPlayer } from "../../../utils/types/gameTypes";
import UserAvatar from "../../User/UserAvatar/UserAvatar";

import styles from './Four.module.scss';

const CaseThree: FC<IPropsForClosestNumberComponent> = ({ users, playerEmojis }) => {
  return (
    <div className={styles.players}>
      {users?.map((user: IPlayer) => (
        <div className={styles.players__player}>
          {playerEmojis[user.userid] && playerEmojis[user.userid] !== 'none' &&
            <div className={styles.players__emoji}>
              <img src={playerEmojis[user.userid]}
                alt="emoji"
                className={styles.players__emojiImage} />
            </div>
          }
          {(user?.choice !== 'none' && user?.choice.toString() !== '9999') &&
            <div className={styles.players__choice}>
              {user?.choice}
            </div>}
          <UserAvatar item={user}
            avatar={user?.avatar}
            key={user?.userid} />
          <p className={styles.players__name}>
            {user && user?.publicname}
          </p>
        </div>
      ))}
    </div>
  )
};

export default CaseThree;

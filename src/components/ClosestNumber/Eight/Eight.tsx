import { FC } from "react";
import styles from './Eight.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";

interface IProps {
  users: any;
}

const CaseEight: FC<IProps> = ({ users }) => {
  return (
    <div className={styles.players}>
      {users?.map((user: any) => (
        <div className={styles.players__player}>
          {user?.emoji !== 'none' &&
            <div className={styles.players__emoji}>
              <img src={user?.emoji} alt="emoji" className={styles.players__emojiImage} />
            </div>
          }
          {user?.choice !== 'none' &&
            <div className={styles.players__choice}>
              {user?.choice}
            </div>}
          <UserAvatar item={user} avatar={user?.avatar} key={user?.userid} />
          <p className={styles.players__name}>
            {user && user?.publicname}
          </p>
        </div>
      ))}
    </div>
  )
};

export default CaseEight;
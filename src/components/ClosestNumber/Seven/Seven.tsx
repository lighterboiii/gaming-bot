import { FC } from "react";
import styles from './Seven.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";

interface IProps {
  users: any;
}

const CaseSeven: FC<IProps> = ({ users }) => {
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

export default CaseSeven;
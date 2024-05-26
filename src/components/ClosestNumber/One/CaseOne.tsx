import { FC } from "react";
import styles from './CaseOne.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";

interface IProps {
  users: any;
}

const Case: FC<IProps> = ({ users }) => {
  return (
    <div
      className={styles.players}
      style={users?.length <= 2 ? { width: '180%' } : {}}
    >
      {users?.map((user: any) => (
        <div
          className={styles.players__player}
          style={users?.length <= 2 ? { width: '90px', height: '90px' } : {}}>
          {user?.emoji !== 'none' &&
            <div 
            className={styles.players__emoji}
            style={{ left: '-25%' }}
            >
              <img src={user?.emoji} alt="emoji" className={styles.players__emojiImage} />
            </div>
          }
          {user?.choice !== "none" && <div className={styles.players__choice} style={{ right: '-20%' }}>{user?.choice}</div>}
          <UserAvatar item={user} avatar={user?.avatar} key={user?.userid} />
          <p
            className={styles.players__name}
            style={users?.length > 2 ? { padding: '1px 2px', fontSize: '10px' } : {}}
          >
            {user && user?.publicname}
          </p>
        </div>
      ))}
    </div>
  )
};

export default Case;
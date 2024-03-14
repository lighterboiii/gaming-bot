import { FC } from "react";
import styles from './SecondaryUserInfo.module.scss';
import UserAvatar from "../UserAvatar/UserAvatar";

const UserInfo: FC = () => {
  return (
    <div className={styles.user}>
      <div className={styles.user__userInfo}>
        <div className={styles.user__avatarContainer}>
          <UserAvatar />
        </div>
        <div className={styles.user__textElements}>
          <p className={styles.user__name}>Максим</p>
          <div className={styles.user__money}>
            <p className={styles.user__text}>💵 500</p>
            <p className={styles.user__text}>🔰 250</p>
          </div>
          <button>баланс</button>
        </div>
      </div>
    </div>
  )
}

export default UserInfo;
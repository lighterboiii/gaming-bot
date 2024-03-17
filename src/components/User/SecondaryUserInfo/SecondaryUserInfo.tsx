import { FC } from "react";
import styles from './SecondaryUserInfo.module.scss';
import UserAvatar from "../UserAvatar/UserAvatar";
import useTelegram from "../../../hooks/useTelegram";
import { useAppSelector } from "../../../services/reduxHooks";

const UserInfo: FC = () => {
  const { tg } = useTelegram();
  const userData = useAppSelector(store => store.user.userData);

  return (
    <div className={styles.user}>
      <div className={styles.user__userInfo}>
        <div className={styles.user__avatarContainer}>
          <UserAvatar />
        </div>
        <div className={styles.user__textElements}>
          <p className={styles.user__name}>{userData ? userData?.info?.publicname : 'Максим'}</p>
          <div className={styles.user__money}>
            <p className={styles.user__text}>💵 {userData ? `${userData?.info.coins}` : '0'}</p>
            <p className={styles.user__text}>🔰 {userData ? `${userData?.info.tokens}` : '0'}</p>
          </div>
          <button type="button" className={styles.user__balance} onClick={() => {tg.close()}}>баланс</button>
        </div>
      </div>
    </div>
  )
}

export default UserInfo;
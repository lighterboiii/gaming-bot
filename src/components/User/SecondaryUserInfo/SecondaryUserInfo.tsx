/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './SecondaryUserInfo.module.scss';
import UserAvatar from "../UserAvatar/UserAvatar";
import useTelegram from "../../../hooks/useTelegram";
import { useAppSelector } from "../../../services/reduxHooks";
import { formatNumber } from "../../../utils/additionalFunctions";
import { postEvent } from "@tma.js/sdk";

const UserInfo: FC = () => {
  const { tg } = useTelegram();
  const userData = useAppSelector(store => store.app.info);

  const handleClickBalance = () => {
    // tg.openTelegramLink('https://t.me/lighterboygamebot');
    // postEvent('web_app_trigger_haptic_feedback', {
    //   type: 'notification',
    //   notification_type: 'warning',
    // });
    tg.close();
  };

  return (
    <div className={styles.user}>
      <div className={styles.user__userInfo}>
        <div className={styles.user__avatarContainer}>
          <UserAvatar />
        </div>
        <div className={styles.user__textElements}>
          <p className={styles.user__name}>{userData && userData?.publicname}</p>
          <div className={styles.user__money}>
            <p className={styles.user__text}>💵 {userData ? formatNumber(userData?.coins) : '0'}</p>
            <p className={styles.user__text}>🔰 {userData ? formatNumber(userData?.tokens) : '0'}</p>
            <p className={styles.user__text}>🔋 {userData ? userData?.user_energy_drinks : '0'}</p>
            <p className={styles.user__text}>🧙‍♂️ {userData ? userData?.user_exp : '0'}</p>
          </div>
          <button type="button" className={styles.user__balance} onClick={handleClickBalance}>баланс</button>
        </div>
      </div>
    </div>
  )
}

export default UserInfo;
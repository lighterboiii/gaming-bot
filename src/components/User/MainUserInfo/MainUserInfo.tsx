/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './MainUserInfo.module.scss';
import { Link } from "react-router-dom";
import useTelegram from "../../../hooks/useTelegram";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useAppSelector } from "../../../services/reduxHooks";
import CircleButton from "../../ui/CircleButton/CircleButton";
import { formatNumber } from "../../../utils/additionalFunctions";
import { postEvent } from "@tma.js/sdk";
import { inviteLink } from "../../../api/requestData";

interface IProps {
  toggleOverlay: () => void;
  isOverlayOpen?: boolean;
}

const MainUserInfo: FC<IProps> = ({ toggleOverlay, isOverlayOpen }) => {
  const { tg } = useTelegram();
  const userData = useAppSelector(store => store.app.info);
  const translation = useAppSelector(store => store.app.languageSettings);
  const handleClickBalance = () => {
    tg.openTelegramLink(inviteLink);
    // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'warning', });
    tg.close();
  };

  return (
    <div className={styles.userInfo}>
      <div className={styles.userInfo__content}>
        <div className={styles.userInfo__avatarContainer}>
          <UserAvatar />
        </div>
        <div className={styles.userInfo__info}>
          <div className={styles.userInfo__textElements}>
            <p className={styles.userInfo__name}>{userData && userData?.publicname}</p>
            <div className={styles.userInfo__money}>
              <div className={styles.userInfo__textWrapper}>
                <p className={styles.userInfo__text}>💵 {userData ? formatNumber(userData?.coins) : '0'}</p>
                <p className={styles.userInfo__text}>🔰 {userData ? formatNumber(userData?.tokens) : '0'}</p>
              </div>
              <div className={styles.userInfo__textWrapper}>
                <p className={styles.userInfo__text}>🔋 {userData ? userData?.user_energy_drinks : '0'}</p>
                <p className={styles.userInfo__text}>🧙‍♂️ {userData ? userData?.user_exp : '0'}</p>
              </div>
            </div>
          </div>
          <button type="button" className={styles.userInfo__balance} onClick={handleClickBalance}>
            {translation?.webapp_balance}
          </button>
        </div>
      </div>
      <div className={styles.userInfo__linkContainer}>
        <button className={styles.userInfo__button} onClick={toggleOverlay}>
          <CircleButton
            shadow
            isWhiteBackground
            iconType={isOverlayOpen ? "cross" : "ref"}
            width={20}
            height={20}
            color="#d51845"
          />
        </button>
        <Link to={'/go'} className={styles.userInfo__tgLink}>
          <CircleButton
            shadow
            isWhiteBackground
            iconType="community"
            width={20}
            height={20}
          />
        </Link>
      </div>
    </div >
  )
}

export default MainUserInfo;
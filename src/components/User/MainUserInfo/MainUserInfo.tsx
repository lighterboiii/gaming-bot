/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef } from "react";
import styles from './MainUserInfo.module.scss';
import { Link } from "react-router-dom";
import useTelegram from "../../../hooks/useTelegram";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useAppSelector } from "../../../services/reduxHooks";
import CircleButton from "../../ui/CircleButton/CircleButton";
import { formatNumber } from "../../../utils/additionalFunctions";
import { postEvent } from "@tma.js/sdk";
import { inviteLink } from "../../../api/requestData";
import WalletIcon from "../../../icons/Wallet/WalletIcon";
import LevelIcon from "../../../icons/Level/LevelIcon";
import tasks from '../../../images/tasks.png';

interface IProps {
  toggleOverlay: () => void;
  setWheelOverlayOpen: () => void;
}

const MainUserInfo: FC<IProps> = ({ toggleOverlay, setWheelOverlayOpen }) => {
  const { tg } = useTelegram();
  const userData = useAppSelector(store => store.app.info);
  const translation = useAppSelector(store => store.app.languageSettings);
  const userNameRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const userNameElement = userNameRef.current;
    if (userNameElement && userNameElement.scrollWidth > userNameElement.clientWidth) {
      userNameElement.classList.add(styles.animateOverflow);
    } else {
      userNameElement?.classList.remove(styles.animateOverflow);
    }
  }, [userData]);

  const handleClickBalance = () => {
    tg.openTelegramLink(inviteLink);
    postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'warning', });
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
            <div className={styles.userInfo__name}>
              <LevelIcon level={userData?.user_exp} width={24} height={24} />
              <div className={styles.userInfo__overflow}>
                <p className={styles.userInfo__userName} ref={userNameRef}>
                  {userData && userData?.publicname}
                  </p>
              </div>
            </div>
            <p className={styles.userInfo__text}>
              <span>💵</span>
              {userData ? formatNumber(userData?.coins) : '0'}
            </p>
            <p className={styles.userInfo__text}>
              <span>🔰</span>
              {userData ? formatNumber(userData?.tokens) : '0'}
            </p>
          </div>
          <div className={styles.userInfo__buttons}>
            <button type="button" className={styles.userInfo__balance} onClick={handleClickBalance}>
              <WalletIcon
                width={12}
                height={12}
              />
              {translation?.webapp_balance}
            </button>
            <button type="button" className={styles.userInfo__tasksButton} onClick={toggleOverlay}>
              <img src={tasks} alt="task_png" className={styles.userInfo__tasksImg} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.userInfo__linkContainer}>
        <button className={styles.userInfo__button} onClick={setWheelOverlayOpen}>
          <CircleButton
            shadow
            isWhiteBackground
            iconType="fortune"
            width={22}
            height={22}
            color="#d51845"
          />
        </button>
        <Link to={'/go'} className={styles.userInfo__tgLink}>
          <CircleButton
            shadow
            isWhiteBackground
            iconType="community"
            width={22}
            height={22}
          />
        </Link>
      </div>
    </div >
  )
}

export default MainUserInfo;
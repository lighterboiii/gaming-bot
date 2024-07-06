import { postEvent } from "@tma.js/sdk";
import { FC, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { balanceLink, groupLink } from "API/requestData";
import useTelegram from "Hooks/useTelegram";
import CommunityIcon from "Icons/Community/CommunityIcon";
import LevelIcon from "Icons/Level/LevelIcon";
import WalletIcon from "Icons/Wallet/WalletIcon";
import { useAppSelector } from "Services/reduxHooks";
import { formatNumber } from "Utils/additionalFunctions";

import CircleButton from "../../ui/CircleButton/CircleButton";
import UserAvatar from "../UserAvatar/UserAvatar";

import styles from './MainUserInfo.module.scss';

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
    tg.openTelegramLink(balanceLink);
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
              <LevelIcon level={userData?.user_exp}
                width={24}
                height={24} />
              <div className={styles.userInfo__overflow}>
                <p className={styles.userInfo__userName}
                  ref={userNameRef}>
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
            <button type="button"
              className={styles.userInfo__balance}
              onClick={handleClickBalance}>
              <WalletIcon
                width={12}
                height={12}
              />
              {translation?.webapp_balance}
            </button>
            <Link to={groupLink}
              className={styles.userInfo__tasksButton}>
              <CommunityIcon width={16}
                height={14}
                color="#FFF" />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.userInfo__linkContainer}>
        <button type="button"
          className={styles.userInfo__button}
          onClick={setWheelOverlayOpen}>
          <CircleButton
            shadow
            isWhiteBackground
            iconType="fortune"
            width={24}
            height={24}
            color="#d51845"
          />
        </button>
        <button type="button"
          className={styles.userInfo__button}
          onClick={toggleOverlay}>
          <CircleButton
            shadow
            isWhiteBackground
            iconType="tasks"
          />
        </button>
      </div>
    </div >
  )
}

export default MainUserInfo;

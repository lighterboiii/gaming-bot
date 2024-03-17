/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './MainUserInfo.module.scss';
import { Link } from "react-router-dom";
import useTelegram from "../../../hooks/useTelegram";
import { roomsUrl } from "../../../utils/routes";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useAppSelector } from "../../../services/reduxHooks";
import CircleButton from "../../ui/CircleButton/CircleButton";

interface iProps {
  toggleOverlay: () => void;
  isOverlayOpen?: boolean;
}

const MainUserInfo: FC<iProps> = ({ toggleOverlay, isOverlayOpen }) => {
  const { tg } = useTelegram();
  const userData = useAppSelector(store => store.user.userData);

  return (
    <div className={styles.userInfo}>
      <div className={styles.userInfo__content}>
        <div className={styles.userInfo__avatarContainer}>
          <UserAvatar />
        </div>
        <div className={styles.userInfo__info}>
          <div className={styles.userInfo__textElements}>
            <p className={styles.userInfo__text}>{userData ? userData?.info?.publicname : 'Максим'}</p>
            <div className={styles.userInfo__money}>
              <p className={styles.userInfo__text}>💵 {userData ? `${userData?.info.coins}` : '0'}</p>
              <p className={styles.userInfo__text}>🔰 {userData ? `${userData?.info.tokens}` : '0'}</p>
            </div>
          </div>
          <button type="button" className={styles.userInfo__balance} onClick={() => {tg.close()}}>
            баланс
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
        <Link to={roomsUrl} className={styles.userInfo__tgLink}>
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
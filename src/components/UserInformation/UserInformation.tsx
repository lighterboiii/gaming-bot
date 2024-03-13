/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './UserInformation.module.scss';
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import { Link } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { roomsUrl } from "../../utils/routes";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useAppSelector } from "../../services/reduxHooks";
import CircleButton from "../ui/CircleButton/CircleButton";

interface iProps {
  toggleOverlay: () => void;
}

const UserInfo: FC<iProps> = ({ toggleOverlay }) => {

  const { tg, user } = useTelegram();
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
              <p className={styles.userInfo__text}>💵 {userData ? `${userData?.info.coins}` : '10'}</p>
              <p className={styles.userInfo__text}>🔰 {userData ? `${userData?.info.tokens}` : '20'}</p>
            </div>
          </div>
          <Link to='/balance' className={styles.userInfo__balanceLink}>
            баланс
          </Link>
        </div>
      </div>
      <div className={styles.userInfo__linkContainer}>
        <button className={styles.userInfo__button} onClick={toggleOverlay}>
          <CircleButton chevronPosition="down" shadow isWhiteBackground chevron />
        </button>
        <Link to={roomsUrl} className={styles.userInfo__tgLink}>
          <CircleButton chevronPosition="right" shadow isWhiteBackground chevron />
        </Link>
      </div>
    </div >
  )
}

export default UserInfo;
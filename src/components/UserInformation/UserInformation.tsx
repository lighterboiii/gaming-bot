/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './UserInformation.module.scss';
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import { Link } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { roomsUrl } from "../../utils/routes";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useAppSelector } from "../../services/reduxHooks";

const UserInfo: FC = () => {
  const { tg, user } = useTelegram();
  const userData = useAppSelector(store => store.user.userData);

  return (
    <div className={styles.userInfo}>
      <div className={styles.userInfo__content}>
        <div className={styles.userInfo__avatarContainer}>
          <UserAvatar />
        </div>
        <div className={styles.userInfo__textElements}>
          <p className={styles.userInfo__text}>{userData ? userData?.info?.publicname : 'Максим'}</p>
          <p className={styles.userInfo__text}>{userData ? `${userData?.info.coins}` : '10'} 💵</p>
          <p className={styles.userInfo__text}>{userData ? `${userData?.info.tokens}` : '20'}🔰</p>
        </div>
        {/* Ссылку ниже можно переделать в отдельный UI компонент */}
        <Link to='/balance' className={styles.userInfo__balanceLink}>
          <ChevronIcon position="right" color="#f01151" width={20} height={20} />
        </Link>
      </div>
      <div className={styles.userInfo__linkContainer}>
        <div className={styles.userInfo__link} >
          {/* Заменить to ссылки */}
          <Link to={roomsUrl} className={styles.userInfo__tgLink}>
            <p className={styles.userInfo__communityText}>Сообщество</p>
            <p className={styles.userInfo__communityText}>GoWIN <br />🌐</p>
          </Link>
        </div>
        <p className={styles.userInfo__smallText}>Будем на связи 👆</p>
      </div>
    </div >
  )
}

export default UserInfo;
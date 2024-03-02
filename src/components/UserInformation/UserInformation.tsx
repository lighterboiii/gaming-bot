/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './UserInformation.module.scss';
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import { Link } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";

const UserInfo: FC = () => {
  const { tg, user } = useTelegram();
  
  return (
    <div className={styles.userInfo}>
      <div className={styles.userInfo__content}>
        <img src={user ? `${user?.photo_url}` : "https://i.pravatar.cc"} alt="user_avatar" className={styles.userInfo__userAvatar} />
        <div className={styles.userInfo__textElements}>
          <p className={styles.userInfo__text}>{user ? user?.first_name : 'Максим'}</p>
          <p className={styles.userInfo__text}>15.3 💵</p>
          <p className={styles.userInfo__text}>1262.1 🔰</p>
        </div>
        {/* Ссылку ниже можно переделать в отдельный UI компонент */}
        <Link to='/balance' className={styles.userInfo__balanceLink}>
          <ChevronIcon position="right" color="#f01151" width={20} height={20} />
        </Link>
      </div>
      <div className={styles.userInfo__linkContainer}>
        <div className={styles.userInfo__link} >
          {/* Заменить to ссылки */}
          <Link to='/balance' className={styles.userInfo__tgLink}>Сообщество <br></br> GoWIN <br></br>🌐</Link>
        </div>
        <p className={styles.userInfo__smallText}>Будем на связи 👆</p>
      </div>
    </div >
  )
}

export default UserInfo;
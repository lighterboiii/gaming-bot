import { FC } from "react";
import styles from './ShopLink.module.scss';
import { Link } from "react-router-dom";
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import Countdown from "../Countdown/Countdown";
import useTelegram from "../../hooks/useTelegram";
import { roomsUrl } from "../../utils/routes";
import UserAvatar from "../UserAvatar/UserAvatar";

const ShopLink: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useTelegram();

  return (
    <Link to={roomsUrl} className={styles.shopLink}>
      <div className={styles.shopLink__left}>
        <p className={styles.shopLink__text}>Магазин</p>
        <div className={styles.shopLink__update}>
          <p className={styles.shopLink__updateText}>
            Обновление магазина через: <Countdown />
          </p>
        </div>
      </div>
      <div className={styles.shopLink__right}>
        <div className={styles.shopLink__avatarContainer}>
          <div className={styles.shopLink__avatarWrapper}>
            <UserAvatar />
          </div>
        </div>
      </div>
      <div className={styles.shopLink__chevron}>
        <ChevronIcon
          color="#f01151"
          width={24}
          height={24}
        />
      </div>
    </Link>
  )
}

export default ShopLink;
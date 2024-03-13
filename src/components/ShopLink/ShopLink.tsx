/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './ShopLink.module.scss';
import { Link } from "react-router-dom";
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import Countdown from "../Countdown/Countdown";
import useTelegram from "../../hooks/useTelegram";
import { roomsUrl } from "../../utils/routes";
import gowinLogo from '../../images/gowin.png';
import girl from '../../images/Shop_small_char.png';

const ShopLink: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useTelegram();

  return (
    <Link to={roomsUrl} className={styles.shopLink}>
      <div className={styles.shopLink__content}>
        <img src={gowinLogo} alt="main_logo" className={styles.shopLink__logo} />
        <h2 className={styles.shopLink__title}>Магазин</h2>
        {/* <div className={styles.shopLink__update}>
          <p className={styles.shopLink__updateText}>
            Обновление магазина через: <Countdown />
          </p>
        </div> */}
        <img src={girl} alt="character"  className={styles.shopLink__char} />
      </div>
    </Link>
  )
}

export default ShopLink;
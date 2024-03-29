/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './ShopLink.module.scss';
import { Link } from "react-router-dom";
import { shopUrl } from "../../../utils/routes";
import gowinLogo from '../../../images/gowin.png';
import girl from '../../../images/Shop_small_char.png';
import { postEvent } from "@tma.js/sdk";

const ShopLink: FC = () => {

  const handleGetHapticFeedback = () => {
    postEvent('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: 'light',
    });
  };

  return (
    <Link
      to={shopUrl}
      onClick={handleGetHapticFeedback}
      className={styles.shopLink}
    >
      <div className={styles.shopLink__content}>
        <img src={gowinLogo} alt="main_logo" className={styles.shopLink__logo} />
        <h2 className={styles.shopLink__title}>Магазин</h2>
        <img src={girl} alt="character" className={styles.shopLink__char} />
      </div>
    </Link>
  )
};

export default ShopLink;
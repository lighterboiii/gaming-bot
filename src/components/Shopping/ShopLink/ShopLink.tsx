/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import { Link } from "react-router-dom";

import gowinLogo from '../../../images/gowin.png';
import { useAppSelector } from "../../../services/reduxHooks";
import { triggerHapticFeedback } from "../../../utils/hapticConfig";
import { shopUrl } from "../../../utils/routes";

import styles from './ShopLink.module.scss';

interface IProps {
  shopImageUrl: string | null;
}

const ShopLink: FC<IProps> = ({ shopImageUrl }) => {
  const translation = useAppSelector(store => store.app.languageSettings);
  
  const handleGetHapticFeedback = () => {
    triggerHapticFeedback('impact', 'light');
  };

  return (
    <Link
      to={shopUrl}
      onClick={handleGetHapticFeedback}
      className={styles.shopLink}
    >
      <div className={styles.shopLink__content}>
        <img src={gowinLogo}
          alt="main_logo"
          className={styles.shopLink__logo} />
        <h2 className={styles.shopLink__title}>{translation?.menu_shop}</h2>
        <img
          src={shopImageUrl ? shopImageUrl : ''}
          alt="character"
          className={styles.shopLink__char} />
      </div>
    </Link>
  )
};

export default ShopLink;

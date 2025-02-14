/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import gowinLogo from '../../../images/gowin.png';
import { useAppSelector } from "../../../services/reduxHooks";
import { triggerHapticFeedback } from "../../../utils/hapticConfig";
import { shopUrl } from "../../../utils/routes";
import { getCachedShopImage } from '../../../utils/shopImageCache';

import styles from './ShopLink.module.scss';

interface IProps {
  shopImageUrl: string | null;
}

const ShopLink: FC<IProps> = ({ shopImageUrl }) => {
  const translation = useAppSelector(store => store.app.languageSettings);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const cachedImage = getCachedShopImage();
    if (cachedImage) {
      setImageUrl(cachedImage);
    } else if (shopImageUrl) {
      setImageUrl(shopImageUrl);
    }
  }, [shopImageUrl]);

  const handleGetHapticFeedback = () => {
    triggerHapticFeedback('impact', 'light');
  };

  if (!imageUrl) return null;

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
          src={imageUrl}
          alt="character"
          className={styles.shopLink__char}
          loading="eager"
        />
      </div>
    </Link>
  )
};

export default ShopLink;

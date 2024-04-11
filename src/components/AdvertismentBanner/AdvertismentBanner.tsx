/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './AdvertismentBanner.module.scss';
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import { bannersData } from "../../utils/mockData";
import { postEvent } from "@tma.js/sdk";

interface IProps {
  onBannerClick: (bannerData: any) => void;
}

const AdvertisementBanner: FC<IProps> = ({ onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentBannerData = bannersData[currentIndex];
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
    onBannerClick(currentBannerData);
  };

  return (
    <div 
    className={styles.banner} 
    style={{ backgroundImage: bannersData[currentIndex].backgroundImage }}
    >
      <button
               className={`${styles.banner__sliderButton} ${styles.banner__leftButton}`}
        onClick={() => goToSlide((currentIndex - 1 + bannersData.length) % bannersData.length)}
      > 
        <ChevronIcon
          position="left"
          width={12}
          height={12}
          color="#d51845"
        />
      </button>
      <div className={styles.banner__link} onClick={handleBannerClick}></div>
      <button
        className={`${styles.banner__sliderButton} ${styles.banner__rightButton}`}
        onClick={() => goToSlide((currentIndex + 1) % bannersData.length)}
      >
        <ChevronIcon
          position="right"
          width={12}
          height={12}
          color="#d51845"
        />
      </button>
      <div className={styles.banner__indicators}>
        {bannersData.map((_, index) => (
          <button
            key={index}
            className={`${styles.banner__indicator} ${index === currentIndex ? styles.activeIndicator : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
};

export default AdvertisementBanner;
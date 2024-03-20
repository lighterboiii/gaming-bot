import { FC, useState } from "react";
import styles from './AdvertismentBanner.module.scss';
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import { bannersData } from "../../utils/mockData";
import { Link } from "react-router-dom";

interface IProps {
  toggleOverlay?: () => void;
  isOverlayOpen?: boolean;
  onBannerClick: (bannerData: any) => void;
}

const AdvertisementBanner: FC<IProps> = ({ toggleOverlay, isOverlayOpen, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentBannerData = bannersData[currentIndex];
    onBannerClick(currentBannerData);
  };

  return (
    <div className={styles.banner} style={{ backgroundImage: bannersData[currentIndex].backgroundImage }}>
      <button
        className={styles.banner__sliderButton}
        onClick={() => goToSlide((currentIndex - 1 + bannersData.length) % bannersData.length)}
      >
        <ChevronIcon
          position="left"
          width={24}
          height={24}
        />
      </button>
      <div className={styles.banner__link} onClick={handleBannerClick}>
        {/* <p className={styles.banner__text}>{bannersData[currentIndex].text}</p> */}
      </div>
      <button
        className={styles.banner__sliderButton}
        onClick={() => goToSlide((currentIndex + 1) % bannersData.length)}
      >
        <ChevronIcon
          position="right"
          width={24}
          height={24}
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
}

export default AdvertisementBanner;
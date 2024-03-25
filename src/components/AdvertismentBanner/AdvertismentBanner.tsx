/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useRef, useState } from "react";
import styles from './AdvertismentBanner.module.scss';
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import { bannersData } from "../../utils/mockData";

interface IProps {
  onBannerClick: (bannerData: any) => void;
}

const AdvertisementBanner: FC<IProps> = ({ onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentBannerData = bannersData[currentIndex];
    onBannerClick(currentBannerData);
  };

  const handleSwipeStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    touchStartX.current = e.touches[0].clientX;
  };

  const handleSwipeMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchStartX.current === null) return;

    const currentX = e.touches[0].clientX;
    const difference = touchStartX.current - currentX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        goToSlide((currentIndex + 1) % bannersData.length);
      } else {
        goToSlide((currentIndex - 1 + bannersData.length) % bannersData.length);
      }
      touchStartX.current = null;
    }
  };

  return (
    <div 
    className={styles.banner} 
    style={{ backgroundImage: bannersData[currentIndex].backgroundImage }}
    onTouchStart={handleSwipeStart}
    onTouchMove={handleSwipeMove}
    >
      {/* <button
        className={styles.banner__sliderButton}
        onClick={() => goToSlide((currentIndex - 1 + bannersData.length) % bannersData.length)}
      >
        <ChevronIcon
          position="left"
          width={24}
          height={24}
        />
      </button> */}
      <div className={styles.banner__link} onClick={handleBannerClick}>
        {/* <p className={styles.banner__text}>{bannersData[currentIndex].text}</p> */}
      </div>
      {/* <button
        className={styles.banner__sliderButton}
        onClick={() => goToSlide((currentIndex + 1) % bannersData.length)}
      >
        <ChevronIcon
          position="right"
          width={24}
          height={24}
        />
      </button> */}
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
// import { postEvent } from "@tma.js/sdk";
import { FC, useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

import { getCachedBanners } from "utils/bannerCache";
import { triggerHapticFeedback } from "utils/hapticConfig";

import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import { IBannerData } from "../../../utils/types/mainTypes";

import styles from "./AdvertisementBanner.module.scss";

interface IProps {
  bannersData: IBannerData[];
  onBannerClick: (bannerData: IBannerData) => void;
}

const AdvertisementBanner: FC<IProps> = ({ bannersData, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cachedBanners, setCachedBanners] = useState(getCachedBanners());

  useEffect(() => {
    setCachedBanners(getCachedBanners());
  }, [bannersData]);

  const activeBanners = cachedBanners || bannersData;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    triggerHapticFeedback('impact', 'soft');
  };

  const handleBannerClick = () => {
    const currentBannerData = activeBanners[currentIndex];
    triggerHapticFeedback("impact", "soft");
    onBannerClick(currentBannerData);
  };

  const handleNextSlide = () => {
    goToSlide((currentIndex + 1) % activeBanners.length);
  };

  const handlePrevSlide = () => {
    goToSlide((currentIndex - 1 + activeBanners.length) % activeBanners.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextSlide,
    onSwipedRight: handlePrevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    activeBanners && (
      <div
        {...handlers}
        className={styles.banner}
        style={{ backgroundImage: `url(${activeBanners[currentIndex]?.pic})` }}
        role="region"
        aria-label="Advertisement Banner"
      >
        <div className={styles.banner__info}>
          <h3
            className={styles.banner__picHeader}
            style={{ color: `${activeBanners[currentIndex]?.pic_text_color}` }}
          >
            {activeBanners[currentIndex]?.pic_header}
          </h3>
          <p
            className={styles.banner__text}
            style={{ color: `${activeBanners[currentIndex]?.pic_text_color}` }}
          >
            {activeBanners[currentIndex]?.pic_text}
          </p>
        </div>

        <button
          className={`${styles.banner__sliderButton} ${styles['banner__sliderButton--left']}`}
          onClick={handlePrevSlide}
          aria-label="Previous banner"
        >
          <ChevronIcon
            position="left"
            width={12}
            height={12}
            color="#d51845"
          />
        </button>

        <div 
          className={styles.banner__link}
          onClick={handleBannerClick}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${activeBanners[currentIndex]?.pic_header}`}
          onKeyDown={(e) => e.key === 'Enter' && handleBannerClick()}
        />

        <button
          className={`${styles.banner__sliderButton} ${styles['banner__sliderButton--right']}`}
          onClick={handleNextSlide}
          aria-label="Next banner"
        >
          <ChevronIcon
            position="right"
            width={12}
            height={12}
            color="#d51845"
          />
        </button>

        <div className={styles.banner__controls}>
          <div className={styles.banner__indicators}>
            {activeBanners?.map((_, index) => (
              <button
                key={index}
                className={`${styles.banner__indicator} ${
                  index === currentIndex ? styles.activeIndicator : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to banner ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default AdvertisementBanner;

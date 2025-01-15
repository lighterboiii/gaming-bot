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
    // Обновляем кэшированные баннеры при изменении bannersData
    setCachedBanners(getCachedBanners());
  }, [bannersData]);

  // Используем кэшированные баннеры, если они есть
  const activeBanners = cachedBanners || bannersData;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentBannerData = activeBanners[currentIndex];
    triggerHapticFeedback("impact", "soft");
    onBannerClick(currentBannerData);
  };

  const handleNextSlide = () => {
    goToSlide((currentIndex + 1) % activeBanners.length);
    triggerHapticFeedback('impact', 'soft');
  };

  const handlePrevSlide = () => {
    goToSlide((currentIndex - 1 + activeBanners.length) % activeBanners.length);
    triggerHapticFeedback('impact', 'soft');
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
      >
        <div className={styles.banner__info}>
          <h3
            className={styles.banner__picHeader}
            style={{ color: `${activeBanners[currentIndex]?.pic_text_color}`, wordWrap: "break-word" }}
          >
            {activeBanners[currentIndex]?.pic_header}
          </h3>
          <p
            className={styles.banner__text}
            style={{ color: `${activeBanners[currentIndex]?.pic_text_color}`}}
          >
            {activeBanners[currentIndex]?.pic_text}
          </p>
        </div>
        <button
          className={`${styles.banner__sliderButton} ${styles.banner__leftButton}`}
          onClick={handlePrevSlide}
        >
          <ChevronIcon position="left"
            width={12}
            height={12}
            color="#d51845" />
        </button>
        <div className={styles.banner__link}
          onClick={handleBannerClick}></div>
        <button
          className={`${styles.banner__sliderButton} ${styles.banner__rightButton}`}
          onClick={handleNextSlide}
        >
          <ChevronIcon position="right"
            width={12}
            height={12}
            color="#d51845" />
        </button>
        <div className={styles.banner__indicators}>
          {activeBanners?.map((_, index) => (
            <button
              key={index}
              className={`${styles.banner__indicator} ${index === currentIndex ? styles.activeIndicator : ""
                }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default AdvertisementBanner;

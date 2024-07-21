import { postEvent } from "@tma.js/sdk";
import { FC, useState } from "react";
import { useSwipeable } from "react-swipeable";

import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import { IBannerData } from "../../../utils/types/mainTypes";

import styles from "./AdvertisementBanner.module.scss";

interface IProps {
  bannersData: IBannerData[];
  onBannerClick: (bannerData: IBannerData) => void;
}

const AdvertisementBanner: FC<IProps> = ({ bannersData, onBannerClick }) => {

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentBannerData = bannersData[currentIndex];
    // postEvent("web_app_trigger_haptic_feedback", { type: "impact", impact_style: "soft" });
    onBannerClick(currentBannerData);
  };

  const handleNextSlide = () => {
    goToSlide((currentIndex + 1) % bannersData.length);
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
  };

  const handlePrevSlide = () => {
    goToSlide((currentIndex - 1 + bannersData.length) % bannersData.length);
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
  };
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handlers = useSwipeable({
    onSwipedLeft: handleNextSlide,
    onSwipedRight: handlePrevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    bannersData && (
      <div
        {...handlers}
        className={styles.banner}
        style={{ backgroundImage: `url(${bannersData[currentIndex]?.pic})` }}
      >
        <div className={styles.banner__info}>
          <h3
            className={styles.banner__picHeader}
            style={{ color: `${bannersData[currentIndex]?.pic_text_color}` }}
          >
            {bannersData[currentIndex]?.pic_header}
          </h3>
          <p
            className={styles.banner__text}
            style={{ color: `${bannersData[currentIndex]?.pic_text_color}` }}
          >
            {bannersData[currentIndex]?.pic_text}
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
          {bannersData?.map((_, index) => (
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

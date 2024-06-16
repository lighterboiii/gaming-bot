import { FC, useState, useRef, useEffect } from "react";
import styles from "./AdvertismentBanner.module.scss";
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import { postEvent } from "@tma.js/sdk";
import { IBannerData } from "../../../utils/types/mainTypes";

interface IProps {
  bannersData: IBannerData[];
  onBannerClick: (bannerData: IBannerData) => void;
}

const AdvertisementBanner: FC<IProps> = ({ bannersData, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentBannerData = bannersData[currentIndex];
    postEvent("web_app_trigger_haptic_feedback", { type: "impact", impact_style: "soft" });
    onBannerClick(currentBannerData);
  };

  const handleNextSlide = () => {
    goToSlide((currentIndex + 1) % bannersData.length);
  };

  const handlePrevSlide = () => {
    goToSlide((currentIndex - 1 + bannersData.length) % bannersData.length);
  };

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!startX.current || !startY.current) {
      return;
    }

    const diffX = e.touches[0].clientX - startX.current;
    const diffY = e.touches[0].clientY - startY.current;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handlePrevSlide();
      } else {
        handleNextSlide();
      }
    }

    startX.current = 0;
    startY.current = 0;
  };

  useEffect(() => {
    const banner = document.getElementById("banner");

    if (banner) {
      banner.addEventListener("touchstart", handleTouchStart);
      banner.addEventListener("touchmove", handleTouchMove);

      return () => {
        banner.removeEventListener("touchstart", handleTouchStart);
        banner.removeEventListener("touchmove", handleTouchMove);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    bannersData && (
      <div
        id="banner"
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
          <ChevronIcon position="left" width={12} height={12} color="#d51845" />
        </button>
        <div className={styles.banner__link} onClick={handleBannerClick}></div>
        <button
          className={`${styles.banner__sliderButton} ${styles.banner__rightButton}`}
          onClick={handleNextSlide}
        >
          <ChevronIcon position="right" width={12} height={12} color="#d51845" />
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

import { FC, useState } from "react";
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
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentBannerData = bannersData[currentIndex];
    postEvent("web_app_trigger_haptic_feedback", { type: "impact", impact_style: "soft" });
    onBannerClick(currentBannerData);
  };

  return (
    bannersData && (
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${bannersData[currentIndex]?.pic})` }}
      >
        <div className={styles.banner__info}>
          <h3 className={styles.banner__picHeader}>{bannersData[currentIndex]?.pic_header}</h3>
          <p className={styles.banner__text}>{bannersData[currentIndex]?.pic_text}</p>
        </div>
        <button
          className={`${styles.banner__sliderButton} ${styles.banner__leftButton}`}
          onClick={() =>
            goToSlide(
              (currentIndex - 1 + bannersData.length) % bannersData.length
            )
          }
        >
          <ChevronIcon position="left" width={12} height={12} color="#d51845" />
        </button>
        <div className={styles.banner__link} onClick={handleBannerClick}></div>
        <button
          className={`${styles.banner__sliderButton} ${styles.banner__rightButton}`}
          onClick={() => goToSlide((currentIndex + 1) % bannersData.length)}
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
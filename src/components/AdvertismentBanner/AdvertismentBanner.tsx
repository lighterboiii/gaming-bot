import { FC, useState } from "react";
import styles from './AdvertismentBanner.module.scss';
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import { bannersData } from "../../utils/mockData";
import { Link } from "react-router-dom";

const AdvertismentBanner: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
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
      <Link to={bannersData[currentIndex].link} className={styles.banner__link}>
        <p className={styles.banner__text}>{bannersData[currentIndex].text}</p>
      </Link>
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

export default AdvertismentBanner;
import { FC, useState } from "react";
import styles from './AdvertismentBanner.module.scss';
import ChevronIcon from "../../icons/Chevron/ChevronIcon";

const bannersData = [
  { backgroundImage: 'url("https://img.freepik.com/free-photo/young-brunette-in-white-casual-sweater-isolated-on-purple-wall_343596-5603.jpg?w=1800&t=st=1709298098~exp=1709298698~hmac=fd4726320de1ce15ec0366de16a30e5f18fb2d7528571c3583de3b008cc3f267")', text: 'Зови друзей! + 500!' },
  { backgroundImage: 'url("https://img.freepik.com/free-photo/isolated-shot-of-satisfied-male-model-stands-sideways-in-paper-hole-dressed-in-yellow-headgear_273609-25560.jpg?w=1800&t=st=1709298094~exp=1709298694~hmac=a6e66b3c59c7a8f9997613463f49b339a86e1116dcc923b464ddcb6008ca3302")', text: 'Привет, корешок' },
  { backgroundImage: 'url("https://img.freepik.com/free-photo/embarrassed-emotional-red-haired-woman-stands-with-open-mouth-bugged-eyes-points-right-at-copy-space-through-paper-hole_273609-46490.jpg?w=1800&t=st=1709298092~exp=1709298692~hmac=28db23d2f81885c0d1d23655a37b4aa9381c2012969a2a7b6d933a784468a267")', text: 'Это слайдер номер 3, проверяем' },
];
// выше - заглушки для тестирования работы, заменить
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
      <p className={styles.banner__text}>{bannersData[currentIndex].text}</p>
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
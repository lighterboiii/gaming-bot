/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './Balance.module.scss';
import CircleButton from "../ui/CircleButton/CircleButton";
import { useNavigate } from "react-router-dom";
import AdvertisementBanner from "../AdvertismentBanner/AdvertismentBanner";

const Balance: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.balance}>
      {/* <button onClick={() => navigate(-1)} className={styles.balance__chevron}>
        <CircleButton chevronPosition="left" />
      </button> */}
      <h3
        className={styles.balance__h3}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae officia repellendus dolorem eaque facilis?
      </h3>
      <div className={styles.balance__content}>
        <AdvertisementBanner />
      </div>
      <button>Подписатсья</button>
    </div>
  )
}

export default Balance;
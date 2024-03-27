import { FC } from "react"
import styles from './BannerData.module.scss';
import Button from "../ui/Button/Button";


interface IProps {
  data: any;
} // типизировать

const BannerData: FC<IProps> = ({ data }) => {
  return (
    <div className={styles.banner}>
      <div className={styles.banner__header}>
        <h3 className={styles.banner__title}>
          {data.title}
        </h3>
        <div className={styles.banner__bannerWrapper} style={{ backgroundImage: `${data.backgroundImage}` }}></div>
      </div>
      <div className={styles.banner__content}>
        <p className={styles.banner__text}>
          {data.text}
        </p>
        <div className={styles.banner__button}>
          <Button text="Подписаться" handleClick={() => { }} />
        </div>
      </div>
    </div>
  )
};

export default BannerData;
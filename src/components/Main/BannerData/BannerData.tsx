import { FC } from "react"
import styles from './BannerData.module.scss';
import Button from "../../ui/Button/Button";
import { IBannerData } from "../../../utils/types/mainTypes";

interface IProps {
  data: IBannerData;
}

const BannerData: FC<IProps> = ({ data }) => {

  return (
    data && (
      <div className={styles.banner}>
        <div className={styles.banner__content}>
          <div className={styles.banner__header}>
            <h3 className={styles.banner__title}>
              {data.main_header}
            </h3>
            <div className={styles.banner__pic} style={{ backgroundImage: `url(${data.pic})` }}>
              <div className={styles.banner__info}>
                <h3
                  className={styles.banner__picHeader}
                  style={{ color: `${data.pic_text_color}` }}
                >
                  {data.pic_header}
                </h3>
                <p
                  className={styles.banner__infoText}
                  style={{ color: `${data.pic_text_color}` }}
                >
                  {data.pic_text}
                </p>
              </div>
            </div>
          </div>
          <p className={styles.banner__text}>
            {data.main_text}
          </p>
        </div>
        <div className={styles.banner__button}>
          <Button text={data?.button_text} handleClick={() => { }} />
        </div>
      </div>
    )
  )
};

export default BannerData;
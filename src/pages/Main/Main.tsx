import { FC } from "react"
import styles from './Main.module.scss';
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import UserInfo from "../../components/UserInformation/UserInformation";
import AdvertismentBanner from "../../components/AdvertismentBanner/AdvertismentBanner";

const Main: FC = () => {
  return (
    <div className={styles.main}>
      {/* <div className={styles.main__header}> */}
      <h1 className={styles.main__title}>GOWIN</h1>
      <UserInfo />
      {/* </div> */}
      <div className={styles.main__content}>
        <AdvertismentBanner />
        <div className={styles.main__centralButtonsContainer}>
          <button type="button">Открытые комнаты с играми</button>
          <div className={styles.main__smallButtonsContainer}>
            <button type="button">Создать комнату</button>
            <button type="button">Список лидеров <CircleButton /></button>
          </div>
        </div>
      </div>
      <button type="button">Магазин</button>
    </div>
  )
}

export default Main;
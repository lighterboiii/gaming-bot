import { FC } from "react"
import styles from './Main.module.scss';
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import UserInfo from "../../components/UserInformation/UserInformation";
import AdvertismentBanner from "../../components/AdvertismentBanner/AdvertismentBanner";
import SmallButton from "../../components/ui/SmallButton/SmallButton";

const Main: FC = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.main__title}>GOWIN</h1>
      <UserInfo />
      <div className={styles.main__content}>
        <AdvertismentBanner />
        <div className={styles.main__centralButtonsContainer}>
          <div className={styles.main__smallButtonsContainer}>
            <SmallButton
              to="/"
              text="Создать комнату"
              secondaryText="Для игры с другими людьми"
              chevronPosition="right"
            />
            <SmallButton
              to="/"
              text="Таблица лидеров"
              secondaryText="Лучшие из лучших"
              chevronPosition="right"
              isWhiteBackground
            />
          </div>
          <button type="button">
            Открытые комнаты с играми
            <CircleButton />
          </button>
        </div>
      </div>
      <button type="button">Магазин</button>
    </div>
  )
}

export default Main;
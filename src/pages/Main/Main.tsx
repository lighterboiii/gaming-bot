import { FC } from "react"
import styles from './Main.module.scss';
import UserInfo from "../../components/UserInformation/UserInformation";
import AdvertisementBanner from "../../components/AdvertismentBanner/AdvertismentBanner";
import SmallButton from "../../components/ui/SmallButton/SmallButton";
import BigButton from "../../components/ui/BigButton/BigButton";
import ShopLink from "../../components/ShopLink/ShopLink";

const Main: FC = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.main__title}>GOWIN</h1>
      <UserInfo />
      <div className={styles.main__content}>
        <AdvertisementBanner />
        <div className={styles.main__centralButtonsContainer}>
          <div className={styles.main__smallButtonsContainer}>
            {/* Заменить to ссылки */}
            <SmallButton
              to="/create-room"
              text="Создать комнату"
              secondaryText="Для игры с другими людьми"
              chevronPosition="right"
              isWhiteBackground
              shadow
            />
            {/* Заменить to ссылки */}
            <SmallButton
              to="/leaderboard"
              text="Таблица лидеров"
              secondaryText="Лучшие из лучших"
              chevronPosition="right"
            />
          </div>
          {/* Заменить to ссылки */}
          <BigButton
            to="/rooms"
            text="Найти игру"
            secondaryText="Открытые комнаты с играми"
            chevronPosition="right"
            isWhiteBackground
            circleIconColor="#FFF"
            shadow
          />
        </div>
      </div>
      <ShopLink />
    </div>
  )
}

export default Main;
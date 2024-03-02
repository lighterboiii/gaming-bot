import { FC } from "react"
import styles from './Main.module.scss';
import UserInfo from "../../components/UserInformation/UserInformation";
import AdvertismentBanner from "../../components/AdvertismentBanner/AdvertismentBanner";
import SmallButton from "../../components/ui/SmallButton/SmallButton";
import BigButton from "../../components/ui/BigButton/BigButton";
import ShopLink from "../../components/ui/ShopLink/ShopLink";

const Main: FC = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.main__title}>GOWIN</h1>
      <UserInfo />
      <div className={styles.main__content}>
        <AdvertismentBanner />
        <div className={styles.main__centralButtonsContainer}>
          <div className={styles.main__smallButtonsContainer}>
            {/* Заменить to ссылки */}
            <SmallButton
              to="/balance"
              text="Создать комнату"
              secondaryText="Для игры с другими людьми"
              chevronPosition="right"
            />
            {/* Заменить to ссылки */}
            <SmallButton
              to="/balance"
              text="Таблица лидеров"
              secondaryText="Лучшие из лучших"
              chevronPosition="right"
              isWhiteBackground
            />
          </div>
          {/* Заменить to ссылки */}
          <BigButton
            to="/balance"
            text="Открытые комнаты с играми"
            chevronPosition="right"
          />
        </div>
      </div>
      <ShopLink />
      {/* <button type="button" className={styles.temporaryButtonStyle}>
        <p className={styles.temporaryButtonStyle__text}>Магазин</p>
        <div className={styles.temporaryButtonStyle__chevronContainer}>
          <ChevronIcon color="#FF0080" width={24} height={24} position="right" />
        </div>
      </button> */}
    </div>
  )
}

export default Main;
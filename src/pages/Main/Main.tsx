/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react"
import styles from './Main.module.scss';
import MainUserInfo from "../../components/User/MainUserInfo/MainUserInfo";
import AdvertisementBanner from "../../components/AdvertismentBanner/AdvertismentBanner";
import SmallButton from "../../components/ui/SmallButton/SmallButton";
import BigButton from "../../components/ui/BigButton/BigButton";
import ShopLink from "../../components/Shopping/ShopLink/ShopLink";
import Overlay from "../../components/Overlay/Overlay";
import Referral from "../../components/Referral/Referral";
import gowinLogo from '../../images/gowin.png';

const Main: FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [contentBlocked, setContentBlocked] = useState(false);

  const toggleOverlay = () => {
    // window.scrollTo(0, 0);
    setShowOverlay(!showOverlay);
    // setContentBlocked(!contentBlocked);
  };

  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <img src={gowinLogo} alt="main_logo" className={styles.main__logo} />
        <MainUserInfo toggleOverlay={toggleOverlay} isOverlayOpen={showOverlay} />
      </div>
      <div className={`${styles.main__content} ${showOverlay ? styles.hidden : ''}`}>
        <AdvertisementBanner />
        <div className={styles.main__centralButtonsContainer}>
          <div className={styles.main__smallButtonsContainer}>
            <SmallButton
              to="/create-room"
              text="Создать комнату"
              secondaryText="Для игры с другими людьми"
              chevronPosition="right"
              isWhiteBackground
              shadow
            />
            <SmallButton
              to="/leaderboard"
              text="Таблица лидеров"
              secondaryText="Лучшие из лучших"
              chevronPosition="right"
            />
          </div>
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
        <ShopLink />
      </div>
      <Overlay children={<Referral />} show={showOverlay} onClose={toggleOverlay} />
    </div>
  )
}

export default Main;
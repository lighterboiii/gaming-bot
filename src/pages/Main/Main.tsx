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
import BannerData from "../../components/BannerData/BannerData";
import gowinLogo from '../../images/gowin.png';
import { bannersData } from "../../utils/mockData";

const Main: FC = () => {
  const [showReferralOverlay, setShowReferralOverlay] = useState(false);
  const [showBannerOverlay, setShowBannerOverlay] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(bannersData[0]);

  const handleBannerClick = (bannerData: any) => {
    setCurrentBanner(bannerData);
    setShowBannerOverlay(!showBannerOverlay)
    setShowReferralOverlay(false);
  };

  const overlayActive = (showBannerOverlay || showReferralOverlay);

  const toggleOverlay = () => {
    setShowReferralOverlay(!showReferralOverlay);
    setShowBannerOverlay(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <img src={gowinLogo} alt="main_logo" className={styles.main__logo} />
        <MainUserInfo toggleOverlay={toggleOverlay} isOverlayOpen={showReferralOverlay} />
      </div>
      <div className={`${styles.main__content} ${overlayActive ? styles.hidden : ''}`}>
        {/* <div className={styles.main__banner}> */}
        <AdvertisementBanner onBannerClick={handleBannerClick} />
        {/* </div> */}
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
      <Overlay
        children={<Referral />}
        show={showReferralOverlay}
        onClose={toggleOverlay}
      />
      <Overlay
        closeButton
        children={
          <BannerData
            data={currentBanner}
          />}
        show={showBannerOverlay}
        onClose={() => setShowBannerOverlay(!setShowBannerOverlay)}
      />
    </div>
  )
}

export default Main;
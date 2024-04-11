/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from "react"
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
import DailyBonus from "../../components/Bonus/Bonus";
import { useAppSelector } from "../../services/reduxHooks";
import CommunityIcon from "../../icons/Community/CommunityIcon";
import FriendsIcon from "../../icons/Friends/FriendsIcon";
import LeaderBoardIcon from "../../icons/LeaderBoard/LeaderBoardIcon";
import PlayIcon from "../../icons/Play/PlayIcon";

const Main: FC = () => {
  const animationRef = useRef<HTMLDivElement>(null);
  const dailyBonusData = useAppSelector(store => store.app.bonus);
  const translation = useAppSelector(store => store.app.languageSettings);

  const [currentBanner, setCurrentBanner] = useState(bannersData[0]);
  const [showReferralOverlay, setShowReferralOverlay] = useState(false);
  const [showBannerOverlay, setShowBannerOverlay] = useState(false);
  const [showBonusOverlay, setShowBonusOverlay] = useState(false);

  const handleBannerClick = (bannerData: any) => {
    setCurrentBanner(bannerData);
    setShowBannerOverlay(!showBannerOverlay)
    setShowReferralOverlay(false);
  };

  const overlayActive = (showBannerOverlay || showReferralOverlay);

  const toggleRefOverlay = () => {
    setShowReferralOverlay(!showReferralOverlay);
    setShowBannerOverlay(false);
  };
  const toggleBannerOverlay = () => {
    setShowBannerOverlay(!showBannerOverlay);
    setShowReferralOverlay(false);
  };
  const toggleBonusOverlay = () => {
    setShowBonusOverlay(!showBonusOverlay);
  };

  useEffect(() => {
    (dailyBonusData && dailyBonusData !== 'no') ? setShowBonusOverlay(true) : setShowBonusOverlay(false);
    const addAnimationClass = () => {
      if (animationRef.current) {
        animationRef.current.classList.add(styles.shake);
        setTimeout(() => {
          animationRef.current && animationRef.current.classList.remove(styles.shake);
        }, 1000);
      }
    };
    addAnimationClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <img src={gowinLogo} alt="main_logo" className={styles.main__logo} />
        <MainUserInfo toggleOverlay={toggleRefOverlay} isOverlayOpen={showReferralOverlay} />
      </div>
      <div className={`${styles.main__content} ${(overlayActive || showBonusOverlay) ? styles.hidden : ''}`}>
        <div ref={animationRef}>
          <AdvertisementBanner onBannerClick={handleBannerClick} />
        </div>
        <div className={styles.main__centralButtonsContainer}>
          <div className={styles.main__smallButtonsContainer}>
            <SmallButton
              handleClick={() => { }}
              text={
                <>
                  <FriendsIcon width={12} height={12} />
                  <span>
                    Друзья
                  </span>
                </>}
              secondaryText="Приглашай и зарабатывай"
              chevronPosition="right"
              shadow
            />
            <SmallButton
              handleClick={() => { }}
              text={
                <>
                  <LeaderBoardIcon width={12} height={12} />
                  <span>
                    Топ недели
                  </span>
                </>
              }
              secondaryText="Стань лидером недели!"
              chevronPosition="right"
            />
          </div>
          <BigButton
            to="/rooms"
            text={
              <>
                <PlayIcon
                  width={16}
                  height={16}
                />
                <span>
                  Играть!
                </span>
              </>
            }
            secondaryText="Онлайн игры против других"
            chevronPosition="right"
            isWhiteBackground
            circleIconColor="#FFF"
            shadow
          />
        </div>
        <div>
          <ShopLink />
        </div>
      </div>
      <Overlay
        children={
          <Referral />
        }
        show={showReferralOverlay}
        onClose={toggleRefOverlay}
      />
      <Overlay
        buttonColor="#FFF"
        crossColor="#ac1a44"
        closeButton
        children={
          <BannerData
            data={currentBanner}
          />}
        show={showBannerOverlay}
        onClose={toggleBannerOverlay}
      />
      {(dailyBonusData && dailyBonusData !== "no") &&
        <Overlay
          closeButton
          show={showBonusOverlay}
          onClose={() => setShowBonusOverlay(false)}
          children={
            <DailyBonus
              bonus={dailyBonusData}
              closeOverlay={toggleBonusOverlay}
            />}
        />}
    </div>
  )
}

export default Main;
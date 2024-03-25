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
import { userId } from "../../api/requestData";
import { setDailyBonus } from "../../services/appSlice";
import { useAppDispatch } from "../../services/reduxHooks";
import useTelegram from "../../hooks/useTelegram";
import { getAppData } from "../../api/mainApi";

const Main: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useTelegram();
  // const userId = user?.id;
  const [currentBanner, setCurrentBanner] = useState(bannersData[0]);
  const [showReferralOverlay, setShowReferralOverlay] = useState(false);
  const [showBannerOverlay, setShowBannerOverlay] = useState(false);
  const [dailyBonusData, setDailyBonusData] = useState<any | null>(null);
  const [showBonusOverlay, setShowBonusOverlay] = useState(false);
  const animationRef = useRef<HTMLDivElement>(null);

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
  // показать окно бонуса или нет
  useEffect(() => {
    (dailyBonusData && dailyBonusData !== 'no') ? setShowBonusOverlay(true) : setShowBonusOverlay(false);
  }, [dailyBonusData]);

  useEffect(() => {
    const addAnimationClass = () => {
      if (animationRef.current) {
        animationRef.current.classList.add(styles.shake);
        setTimeout(() => {
          animationRef.current && animationRef.current.classList.remove(styles.shake);
        }, 1000);
      }
    };
    const fetchData = async () => {
      try {
        const res = await getAppData(userId);
        dispatch(setDailyBonus(res.daily_bonus));
        setDailyBonusData(res.daily_bonus);
      } catch (error) {
        console.log(error);
      };
    }
    fetchData();
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
      {(dailyBonusData && dailyBonusData !== 'no') &&
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
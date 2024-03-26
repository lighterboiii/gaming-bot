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
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { getReq } from "../../api/api";
import { userId } from "../../api/requestData";
import { setDailyBonus } from "../../services/appSlice";
import useTelegram from "../../hooks/useTelegram";

const Main: FC = () => {
  const { user } = useTelegram();
  const userId = user?.id;
  const animationRef = useRef<HTMLDivElement>(null);
  const dailyBonusData = useAppSelector(store => store.app.bonus);
  const dispatch = useAppDispatch();
  const [currentBanner, setCurrentBanner] = useState(bannersData[0]);
  const [showReferralOverlay, setShowReferralOverlay] = useState(false);
  const [showBannerOverlay, setShowBannerOverlay] = useState(false);
  const [showBonusOverlay, setShowBonusOverlay] = useState(false);
  const [bonus, setBonus] = useState<any>(null);
  
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
  console.log(dailyBonusData);
  console.log(bonus);
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastBonusCheckDate = localStorage.getItem('lastBonusCheckDate');

    if (lastBonusCheckDate === today) {
      if (dailyBonusData && dailyBonusData !== 'no') {
        setBonus(dailyBonusData);
        setShowBonusOverlay(true);
      }
    } else {
      const fetchDailyBonus = async () => {
        try {
          const res: any = await getReq({ uri: 'get_daily_check?user_id=', userId: userId });
          dispatch(setDailyBonus(res.daily_bonus));
          if (res.daily_bonus && res.daily_bonus !== 'no') {
            setDailyBonus(res.daily_bonus);
            setShowBonusOverlay(true);
          }
          localStorage.setItem('lastBonusCheckDate', today);
        } catch (error) {
          console.error('Ошибка в получении ежедневного бонуса:', error);
        }
      };
      fetchDailyBonus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const addAnimationClass = () => {
      if (animationRef.current) {
        animationRef.current.classList.add(styles.shake);
        setTimeout(() => {
          animationRef.current && animationRef.current.classList.remove(styles.shake);
        }, 1000);
      }
    };
    addAnimationClass();
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
      {(bonus && bonus !== "no") &&
        <Overlay
          closeButton
          show={showBonusOverlay}
          onClose={() => setShowBonusOverlay(false)}
          children={
            <DailyBonus
              bonus={bonus}
              closeOverlay={toggleBonusOverlay}
            />}
        />}
    </div>
  )
}

export default Main;
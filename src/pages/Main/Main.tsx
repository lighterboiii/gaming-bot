/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react"
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
import { Bonus, IAppData } from "../../utils/types";
import DailyBonus from "../../components/Shopping/Bonus/Bonus";
import { getReq } from "../../api/api";
import { mainAppDataUri, userId } from "../../api/requestData";
import { setDailyBonus } from "../../services/appSlice";
import { useAppDispatch } from "../../services/reduxHooks";
import useTelegram from "../../hooks/useTelegram";

const Main: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useTelegram();
  // const userId = user?.id;
  const [currentBanner, setCurrentBanner] = useState(bannersData[0]);
  const [showReferralOverlay, setShowReferralOverlay] = useState(false);
  const [showBannerOverlay, setShowBannerOverlay] = useState(false);
  const [dailyBonusData, setDailyBonusData] = useState<Bonus | null>(null);
  const [showBonusOverlay, setShowBonusOverlay] = useState(false);

  const handleBannerClick = (bannerData: any) => {
    setCurrentBanner(bannerData);
    setShowBannerOverlay(!showBannerOverlay)
    setShowReferralOverlay(false);
  };

  const overlayActive = (showBannerOverlay || showReferralOverlay);

  const toggleRefOverlay = () => {
    window.scrollTo(0, 0);
    setShowReferralOverlay(!showReferralOverlay);
    setShowBannerOverlay(false);
  };
  const toggleBannerOverlay = () => {
    window.scrollTo(0, 0);
    setShowBannerOverlay(!showBannerOverlay);
    setShowReferralOverlay(false);
  };
  const toggleBonusOverlay = () => {
    window.scrollTo(0, 0);
    setShowBonusOverlay(!showBonusOverlay);
  };
    // показать окно бонуса или нет
    useEffect(() => {
      dailyBonusData ? setShowBonusOverlay(true) : setShowBonusOverlay(false);
    }, [dailyBonusData]);

    useEffect(() => {
      const fetchShopData = async () => {
        try {
          const res = await getReq<IAppData>({
            uri: mainAppDataUri,
            userId: userId,
          });
          dispatch(setDailyBonus(res.daily_bonus));
          setDailyBonusData(res.daily_bonus);
        } catch (error) {
          console.log(error);
        };
      }
      fetchShopData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <img src={gowinLogo} alt="main_logo" className={styles.main__logo} />
        <MainUserInfo toggleOverlay={toggleRefOverlay} isOverlayOpen={showReferralOverlay} />
      </div>
      <div className={`${styles.main__content} ${(overlayActive || showBonusOverlay) ? styles.hidden : ''}`}>
        <AdvertisementBanner onBannerClick={handleBannerClick} />
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
      {dailyBonusData &&
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
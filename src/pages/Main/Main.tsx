/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLuckInfo } from "API/mainApi";
import { userId } from "API/requestData";
import AdvertisementBanner from "Components/Main/AdvertismentBanner/AdvertismentBanner";
import BannerData from "Components/Main/BannerData/BannerData";
import DailyBonus from "Components/Main/Bonus/Bonus";
import Referral from "Components/Main/Referral/Referral";
import Tasks from "Components/Main/Tasks/Tasks";
import WheelOfLuck from "Components/Main/WheelOfLuck/WheelOfLuck";
import Overlay from "Components/Overlay/Overlay";
import ShopLink from "Components/Shopping/ShopLink/ShopLink";
import BigButton from "Components/ui/BigButton/BigButton";
import SmallButton from "Components/ui/SmallButton/SmallButton";
import MainUserInfo from "Components/User/MainUserInfo/MainUserInfo";
import useTelegram from "Hooks/useTelegram";
import FriendsIcon from "Icons/Friends/FriendsIcon";
import LeaderBoardIcon from "Icons/LeaderBoard/LeaderBoardIcon";
import PlayIcon from "Icons/Play/PlayIcon";
import gowinLogo from 'Images/gowin.png';
import { useAppSelector } from "Services/reduxHooks";

import styles from './Main.module.scss';

export const Main: FC = () => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const userId = user?.id;
  const dailyBonusData = useAppSelector(store => store.app.bonus);
  const translation = useAppSelector(store => store.app.languageSettings);
  const banners = useAppSelector(store => store.app.bannerData);
  const shopImageUrl = useAppSelector(store => store.app.shopImage);
  const [currentBanner, setCurrentBanner] = useState(banners?.length ? banners[0] : null);
  const [showBonusOverlay, setShowBonusOverlay] = useState(false);
  const [showBannerOverlay, setShowBannerOverlay] = useState(false);
  const [showReferralOverlay, setShowReferralOverlay] = useState(false);
  const [showTasksOverlay, setShowTasksOverlay] = useState(false);
  const [showWheelOverlay, setShowWheelOverlay] = useState(false);
  const [luckData, setLuckData] = useState<any>(null);

  const handleBannerClick = (bannerData: any) => {
    setCurrentBanner(bannerData);
    setShowBannerOverlay(!showBannerOverlay);
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
  const toggleTasksOverlay = () => {
    setShowTasksOverlay(!showTasksOverlay);
    setShowReferralOverlay(false);
    setShowBannerOverlay(false);
    setShowWheelOverlay(false);
  };
  const toggleWheelOverlay = () => {
    setShowWheelOverlay(!showWheelOverlay);
    setShowReferralOverlay(false);
    setShowBannerOverlay(false);
    setShowTasksOverlay(false);
  }

  const openWheelOfLuckOverlay = () => {
    getLuckInfo(userId)
      .then((res: any) => {
        setLuckData(res);
      })
    setShowWheelOverlay(!showWheelOverlay);
  };

  useEffect(() => {
    if (dailyBonusData && dailyBonusData !== "no") {
      setShowBonusOverlay(true);
    }
  }, [dailyBonusData]);

  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <img src={gowinLogo}
          alt="main_logo"
          className={styles.main__logo} />
        <MainUserInfo
          toggleOverlay={toggleTasksOverlay}
          setWheelOverlayOpen={openWheelOfLuckOverlay}
        />
      </div>
      <div className={`${styles.main__content} ${(overlayActive || showBonusOverlay) ? styles.hidden : ''}`}>
        <div className={styles.main__addDiv}>
          {banners?.length > 0 && (
            <AdvertisementBanner bannersData={banners}
              onBannerClick={handleBannerClick} />
          )}
        </div>
        <div className={styles.main__centralButtonsContainer}>
          <div className={styles.main__smallButtonsContainer}>
            <SmallButton
              handleClick={() => toggleRefOverlay()}
              text={
                <>
                  <FriendsIcon width={12}
                    height={12} />
                  <span>
                    {translation?.menu_friends}
                  </span>
                </>}
              secondaryText={translation?.menu_invite_earn}
              chevronPosition="right"
            />
            <SmallButton
              handleClick={() => navigate('/leaderboard')}
              text={
                <>
                  <LeaderBoardIcon width={12}
                    height={12} />
                  <span>
                    {translation?.menu_weekly_top}
                  </span>
                </>
              }
              secondaryText={translation?.become_weekly_leader}
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
                  {translation?.menu_play}
                </span>
              </>
            }
            secondaryText={translation?.main_menu_play_desk}
            chevronPosition="right"
            isWhiteBackground
            circleIconColor="#FFF"
            shadow
          />
        </div>
        <div className={styles.main__addDiv}>
          <ShopLink shopImageUrl={shopImageUrl} />
        </div>
      </div>
      <Overlay
        children={
          <Referral />
        }
        show={showReferralOverlay}
        onClose={toggleRefOverlay}
        closeButton
        buttonColor="#FFF"
        crossColor="#ac1a44"
      />
      <Overlay
        buttonColor="#FFF"
        crossColor="#ac1a44"
        closeButton
        children={
          <BannerData
            data={currentBanner}
            closeOverlay={() => setShowBannerOverlay(false)}
          />
        }
        show={showBannerOverlay}
        onClose={toggleBannerOverlay}
      />
      <Overlay
        buttonColor="#FFF"
        crossColor="#ac1a44"
        closeButton
        children={
          <Tasks />
        }
        show={showTasksOverlay}
        onClose={toggleTasksOverlay}
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
      <Overlay
        children={
          <WheelOfLuck data={luckData}
            closeOverlay={() => setShowWheelOverlay(false)} />
        }
        show={showWheelOverlay}
        onClose={toggleWheelOverlay}
        closeButton
        buttonColor="#FFF"
        crossColor="#ac1a44"
      />
    </div>
  )
}

export default Main;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAppData, getLuckInfo } from "../../api/mainApi";
import { userId } from "../../api/requestData";
import AdvertisementBanner from '../../components/Main/AdvertisementBanner/AdvertisementBanner';
import BannerData from "../../components/Main/BannerData/BannerData";
import DailyBonus from "../../components/Main/Bonus/Bonus";
import Friends from "../../components/Main/Friends/Friends";
import Tasks from "../../components/Main/Tasks/Tasks";
import WheelOfLuck from "../../components/Main/WheelOfLuck/WheelOfLuck";
import { Warning } from "../../components/OrientationWarning/Warning";
import Overlay from "../../components/Overlay/Overlay";
import ShopLink from "../../components/Shopping/ShopLink/ShopLink";
import BigButton from "../../components/ui/BigButton/BigButton";
import SmallButton from "../../components/ui/SmallButton/SmallButton";
import MainUserInfo from "../../components/User/MainUserInfo/MainUserInfo";
import useOrientation from "../../hooks/useOrientation";
import useTelegram from "../../hooks/useTelegram";
import FriendsIcon from "../../icons/Friends/FriendsIcon";
import LeaderBoardIcon from "../../icons/LeaderBoard/LeaderBoardIcon";
import PlayIcon from "../../icons/Play/PlayIcon";
import gowinLogo from '../../images/gowin.png';
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { IBannerData, IFortuneData } from "../../utils/types";

import styles from './Main.module.scss';

export const Main: FC = () => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  // const userId = user?.id;
  const dailyBonusData = useAppSelector(store => store.app.bonus);
  const dispatch = useAppDispatch();
  const translation = useAppSelector(store => store.app.languageSettings);
  const banners = useAppSelector(store => store.app.bannerData);
  const shopImageUrl = useAppSelector(store => store.app.shopImage);
  const [currentBanner, setCurrentBanner] = useState(banners?.length ? banners[0] : null);
  const [showBonusOverlay, setShowBonusOverlay] = useState(false);
  const [showBannerOverlay, setShowBannerOverlay] = useState(false);
  const [showReferralOverlay, setShowReferralOverlay] = useState(false);
  const [showTasksOverlay, setShowTasksOverlay] = useState(false);
  const [showWheelOverlay, setShowWheelOverlay] = useState(false);
  const [luckData, setLuckData] = useState<IFortuneData | null>(null);
  const isPortrait = useOrientation();

  const handleBannerClick = (bannerData: IBannerData) => {
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
      .then((res) => {
        const response = res as IFortuneData;
        setLuckData(response);
      })
    setShowWheelOverlay(!showWheelOverlay);
  };

  useEffect(() => {
    if (dailyBonusData && dailyBonusData !== "no") {
      setShowBonusOverlay(true);
    }
  }, [dailyBonusData]);

  if (!isPortrait) {
    return (
      <Warning />
    );
  }

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
          {banners && banners?.length > 0 && (
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
          <Friends />
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
          <WheelOfLuck
            data={luckData}
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

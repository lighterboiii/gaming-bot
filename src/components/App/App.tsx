/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { getAppData, getDailyBonus } from '../../api/mainApi';
import useOrientation from '../../hooks/useOrientation';
import useTelegram from '../../hooks/useTelegram';
import { ClosestNumber } from '../../pages/ClosestNumber/ClosestNumber';
import { CreateRoom } from '../../pages/CreateRoom/CreateRoom';
import { LeaderBoard } from '../../pages/LeaderBoard/LeaderBoard';
import LudkaGame from '../../pages/LudkaGame/LudkaGame';
import Main from '../../pages/Main/Main';
import Monetka from '../../pages/Monetka/Monetka';
import { NotFoundPage } from '../../pages/NotFoundPage/NotFoundPage';
import { OpenedRooms } from '../../pages/OpenedRooms/OpenedRooms';
import { RockPaperScissors } from '../../pages/RockPaperScissors/RockPaperScissors';
import { Shop } from '../../pages/Shop/Shop';
import {
  setBannerData,
  setDailyBonus,
  setFirstGameRuleImage,
  setFirstGameRulesState,
  setLanguageSettings,
  setSecondGameRuleImage,
  setSecondGameRulesState,
  setShopAvailable,
  setShopImage,
  setTaskList,
  setProductsArchive,
  setThirdGameRuleImage,
  setThirdGameRulesState,
  setFourthGameRuleImage,
  setFourthGameRulesState,
  setUserData,
  setUserPhoto
} from '../../services/appSlice';
import { useAppDispatch } from '../../services/reduxHooks';
import { cacheBanners } from '../../utils/bannerCache';
import {
  indexUrl,
  roomsUrl,
  createRoomUrl,
  shopUrl,
  leaderboardUrl,
  roomUrl,
  closestNumberRoomUrl,
  anyUrl,
  ludkaGameUrl,
  monetkaUrl
} from '../../utils/routes';
import { cacheShopImage } from '../../utils/shopImageCache';
import { getUserId } from '../../utils/userConfig';
import Loader from '../Loader/Loader';
import { Warning } from '../OrientationWarning/Warning';
import { ServerErrorHandler } from '../ServerWarning/ServerErrorHandler';

import styles from './App.module.scss';

export const App: FC = () => {
  const { tg } = useTelegram();
  const dispatch = useAppDispatch();
  const userId = getUserId();
  const [loading, setLoading] = useState(true);
  const [serverWarning, setServerWarning] = useState<string>('');
  const isPortrait = useOrientation();

  const isMobile = () => {
    const platform = Telegram.WebApp.platform;
    if (process.env.NODE_ENV === 'development') {
      return true;
    } else if (platform === 'weba' || platform === "tdesktop" || platform === "macos" || platform === "windows") { 
      return false;
    } else if (process.env.WARNING === 'true') {
      return true;
    } else {
      return true;
    }
  }

  document.addEventListener(
    'touchmove',
    (event: TouchEvent) => {
      let target: EventTarget | null = event.target;

      while (target instanceof Node) {
        if (target instanceof Element && target.classList.contains('scrollable')) {
          return;
        }
        target = target.parentNode;
      }
      event.preventDefault();
    },
    { passive: false },
  );

  useEffect(() => {
    tg.setHeaderColor('#d51845');
    tg.expand();
    tg.enableClosingConfirmation();
    tg.ready();
    window.scrollTo(0, 0);
  }, [tg]);

  useEffect(() => {
    const initializeApp = () => {
      setLoading(true);

      getAppData(userId)
        .then(async (res) => {
          if (res.warning === 'warning') {
            setServerWarning(res.warning_message!);
            throw new Error('Server warning');
          }

          const cachePromises = [];
          if (res.ad_info) {
            cachePromises.push(cacheBanners(res.ad_info));
          }
          if (res.shop_image_url) {
            cachePromises.push(cacheShopImage(res.shop_image_url));
          }
          await Promise.all(cachePromises);

          dispatch(setBannerData(res.ad_info));
          dispatch(setShopImage(res.shop_image_url));
          dispatch(setUserData(res.user_info));
          dispatch(setUserPhoto(res.avatar));
          dispatch(setLanguageSettings(res.translate));
          dispatch(setProductsArchive(res.collectibles_data));
          dispatch(setShopAvailable(res.shop_available));
          dispatch(setTaskList(res.tasks_available));

          dispatch(setFirstGameRuleImage(res.game_rule_1_url));
          dispatch(setSecondGameRuleImage(res.game_rule_2_url));
          dispatch(setThirdGameRuleImage(res.game_rule_3_url));
          dispatch(setFourthGameRuleImage(res.game_rule_4_url));
          dispatch(setFirstGameRulesState(res.game_rule_1_show));
          dispatch(setSecondGameRulesState(res.game_rule_2_show));
          dispatch(setThirdGameRulesState(res.game_rule_3_show));
          dispatch(setFourthGameRulesState(res.game_rule_4_show));

          return getDailyBonus(userId);
        })
        .then((bonusRes) => {
          if (bonusRes?.bonus) {
            dispatch(setDailyBonus(bonusRes.bonus));
          }
        })
        .catch((error) => {
          if (error.message !== 'Server warning') {
            console.error('App initialization error:', error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    initializeApp();
  }, [dispatch, userId]);

  if (serverWarning) {
    return <ServerErrorHandler message={serverWarning} />;
  }

  return (
    <div className={styles.app}>
      {loading ? <Loader /> : ''}
      {!isMobile() ? (
        <Warning type="mobile" />
      ) : !isPortrait ? (
        <Warning type="orientation" />
      ) : (
        <Routes>
          <Route path={indexUrl}
            element={<Main />} />
          <Route path={roomsUrl}
            element={<OpenedRooms />} />
          <Route path={createRoomUrl}
            element={<CreateRoom />} />
          <Route path={shopUrl}
            element={<Shop />} />
          <Route path={leaderboardUrl}
            element={<LeaderBoard />} />
          <Route path={roomUrl}
            element={<RockPaperScissors />} />
          <Route path={closestNumberRoomUrl}
            element={<ClosestNumber />} />
          <Route path={ludkaGameUrl}
            element={<LudkaGame />} />
          <Route path={anyUrl}
            element={<NotFoundPage />} />
          <Route path={monetkaUrl}
            element={<Monetka />} />
        </Routes>
      )}
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import { getAppData } from '../../api/mainApi';
import { userId } from '../../api/requestData';
import useTelegram from '../../hooks/useTelegram';
import BetGame from '../../pages/BetGame/BetGame';
import { ClosestNumber } from '../../pages/ClosestNumber/ClosestNumber';
import { CreateRoom } from '../../pages/CreateRoom/CreateRoom';
import { LeaderBoard } from '../../pages/LeaderBoard/LeaderBoard';
import Main from '../../pages/Main/Main';
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
  setUserData,
  setUserPhoto,
  setProductsArchive
} from '../../services/appSlice';
import { useAppDispatch } from '../../services/reduxHooks';
import {
  indexUrl,
  roomsUrl,
  createRoomUrl,
  shopUrl,
  leaderboardUrl,
  roomUrl,
  closestNumberRoomUrl,
  anyUrl,
  ludkaGameUrl
} from '../../utils/routes';
import Loader from '../Loader/Loader';

import styles from './App.module.scss';

export const App: FC = () => {
  const { tg, user } = useTelegram();
  // const userId = user?.id;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const fetchUserData = () => {
      getAppData(userId)
        .then((res) => {
          console.log(res);
          dispatch(setLanguageSettings(res.translate));
          dispatch(setUserData(res.user_info));
          dispatch(setProductsArchive(res.collectibles_data));
          dispatch(setShopAvailable(res.shop_available));
          dispatch(setTaskList(res.tasks_available));
          dispatch(setBannerData(res.ad_info));
          dispatch(setShopImage(res.shop_image_url));
          dispatch(setDailyBonus(res.daily_bonus));
          dispatch(setUserPhoto(res.avatar));
          dispatch(setFirstGameRuleImage(res.game_rule_1_url));
          dispatch(setSecondGameRuleImage(res.game_rule_2_url));
          dispatch(setFirstGameRulesState(res.game_rule_1_show));
          dispatch(setSecondGameRulesState(res.game_rule_2_show));
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        })
        .catch((error) => {
          console.error('Get user data error:', error);
        })
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId]);

  return (
    <div className={styles.app}>
      {loading ? <Loader /> : ''}
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
          element={<BetGame />} />
        <Route path={anyUrl}
          element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

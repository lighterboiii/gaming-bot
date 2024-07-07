/* eslint-disable @typescript-eslint/no-unused-vars */
import { Routes, Route } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { anyUrl, closestNumberRoomUrl, createRoomUrl, indexUrl, leaderboardUrl, roomUrl, roomsUrl, shopUrl } from '../../utils/routes';
import { userId } from '../../api/requestData';
import { useAppDispatch } from '../../services/reduxHooks';
import { setBannerData, setDailyBonus, setFirstGameRuleImage, setFirstGameRulesState, setLanguageSettings, setSecondGameRuleImage, setSecondGameRulesState, setShopAvailable, setShopImage, setTaskList, setUserData, setUserPhoto } from '../../services/appSlice';
import { setProductsArchive } from '../../services/appSlice';
import { getAppData } from '../../api/mainApi';
import styles from './App.module.scss';
import CreateRoom from '../../pages/CreateRoom/CreateRoom';
import Main from '../../pages/Main/Main';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import Shop from '../../pages/Shop/Shop';
import useTelegram from '../../hooks/useTelegram';
import LeaderBoard from '../../pages/LeaderBoard/LeaderBoard';
import Loader from '../Loader/Loader';
import OpenedRooms from '../../pages/OpenedRooms/OpenedRooms';
import RockPaperScissors from '../../pages/RockPaperScissors/RockPaperScissors';
import ClosestNumber from '../../pages/ClosestNumber/ClosestNumber';

const App: FC = () => {
  const { tg, user } = useTelegram();
  // const userId = user?.id;
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

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
          setLoading(false);
        })
        .catch((error) => {
          console.error('Get user data error:', error);
        })
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <div className={styles.app}>
      {loading ? <Loader /> : (
        <Routes>
          <Route path={indexUrl} element={<Main />} />
          <Route path={roomsUrl} element={<OpenedRooms />} />
          <Route path={createRoomUrl} element={<CreateRoom />} />
          <Route path={shopUrl} element={<Shop />} />
          <Route path={leaderboardUrl} element={<LeaderBoard />} />
          <Route path={roomUrl} element={<RockPaperScissors />} />
          <Route path={closestNumberRoomUrl} element={<ClosestNumber />} />
          <Route path={anyUrl} element={<NotFoundPage />} />
        </Routes>
      )}
    </div>
  );
};

export default App;

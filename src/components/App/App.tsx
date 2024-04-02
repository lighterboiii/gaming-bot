/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Routes, Route } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import styles from './App.module.scss';
import CreateRoom from '../../pages/CreateRoom/CreateRoom';
import Main from '../../pages/Main/Main';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import Shop from '../../pages/Shop/Shop';
import useTelegram from '../../hooks/useTelegram';
import LeaderBoard from '../../pages/LeaderBoard/LeaderBoard';
import Loader from '../Loader/Loader';
import OpenedRooms from '../../pages/OpenedRooms/OpenedRooms';
import { createRoomUrl, indexUrl, leaderboardUrl, roomsUrl, shopUrl } from '../../utils/routes';
import { userId } from '../../api/requestData';
import { useAppDispatch } from '../../services/reduxHooks';
import { setDailyBonus, setLanguageSettings, setShopAvailable, setUserData, setUserPhoto } from '../../services/appSlice';
import { setProductsArchive } from '../../services/appSlice';
import { getAppData, getUserAvatarRequest } from '../../api/mainApi';
import RockPaperScissors from '../../pages/RockPaperScissors/RockPaperScissors';

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
  }, []);


  useEffect(() => {
    setLoading(true);
    const fetchUserData = () => {
      getAppData(userId)
        .then((res) => {
          dispatch(setLanguageSettings(res.translate));
          dispatch(setUserData(res.user_info));
          dispatch(setDailyBonus(res.daily_bonus));
          dispatch(setProductsArchive(res.collectibles_data));
          dispatch(setShopAvailable(res.shop_available));
          return getUserAvatarRequest(userId);
        })
        .then((userPhotoResponse) => {
          dispatch(setUserPhoto(userPhotoResponse?.info));
          setLoading(false);
        })
        .catch((error) => {
          console.error('Ошибка в получении данных пользователя:', error);
        });
    };

    fetchUserData();
  }, []);

  return (
    <div className={styles.app}>
      {loading ? <Loader /> : (
        <Routes>
          <Route path={indexUrl} element={<Main />} />
          <Route path={roomsUrl} element={<OpenedRooms />} />
          <Route path={createRoomUrl} element={<CreateRoom />} />
          <Route path={shopUrl} element={<Shop />} />
          <Route path={leaderboardUrl} element={<LeaderBoard />} />
          <Route path="/room/:roomId" element={<RockPaperScissors />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </div>
  );
};

export default App;

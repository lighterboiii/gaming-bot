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
import { createRoomUrl, indexUrl, leaderboardUrl, roomsUrl, shopUrl } from '../../utils/routes';
import { userId } from '../../api/requestData';
import { useAppDispatch } from '../../services/reduxHooks';
import { setDailyBonus, setLavkaAvailable, setShopAvailable, setUserData, setUserPhoto } from '../../services/appSlice';
import Loader from '../Loader/Loader';
import OpenedRooms from '../../pages/OpenedRooms/OpenedRooms';
import { setProductsArchive } from '../../services/appSlice';
import { getAppData, getUserAvatarRequest } from '../../api/mainApi';
import RockPaperScissors from '../Game/GameSettings/GameSettings';
import { getReq } from '../../api/api';

const App: FC = () => {
  const { tg, user } = useTelegram();
  // const userId = user?.id;
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  function handleViewportChange(event: any) {
    if (!event.isExpanded) {
      tg.expand();
    }
  }
  
  useEffect(() => {
    tg.setHeaderColor('#d51845');
    tg.expand();
    tg.onEvent('viewportChanged', handleViewportChange);
    tg.enableClosingConfirmation();
    tg.ready();
    window.scrollTo(0, 0);

    return(() =>{
      tg.offEvent('viewportChanged', handleViewportChange);
    })
  }, []);


  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const res = await getAppData(userId);
        const userPhotoResponse = await getUserAvatarRequest(userId);
        dispatch(setUserData(res.user_info));
        dispatch(setProductsArchive(res.collectibles_data));
        dispatch(setShopAvailable(res.shop_available));
        // dispatch(setLavkaAvailable(res.lavka_available));
        dispatch(setUserPhoto(userPhotoResponse?.info));
        dispatch(setDailyBonus(res.daily_bonus));
        setLoading(false);
      } catch (error) {
        console.error('Ошибка в получении данных пользователя:' + error);
      }
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;

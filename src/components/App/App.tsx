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
import { getReq } from '../../api/api';
import { userId, getUserAvatarUri, mainAppDataUri } from '../../api/requestData';
import { useAppDispatch } from '../../services/reduxHooks';
import { setUserData, setUserPhoto } from '../../services/userSlice';
import Loader from '../Loader/Loader';
import OpenedRooms from '../../pages/OpenedRooms/OpenedRooms';
import { setProductsArchive } from '../../services/userSlice';
import { IAppData, UserPhoto } from '../../utils/types';

const App: FC = () => {
  const { tg, user } = useTelegram();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    tg.setHeaderColor('#d51845');
    tg.expand();
    tg.enableClosingConfirmation();
    tg.ready();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const res = await getReq<IAppData>({
          uri: mainAppDataUri,
          userId: userId,
          // userId: user?.id
        });
        const userPhotoResponse = await getReq<UserPhoto>({
          uri: getUserAvatarUri,
          userId: userId,
          // userId: user?.id,
        });
        dispatch(setUserData(res.user_info));
        dispatch(setProductsArchive(res.collectibles_data));
        dispatch(setUserPhoto(userPhotoResponse?.info));
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
          {/* <Route path='/game' element={<Game />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;

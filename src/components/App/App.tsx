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
import { UserData } from '../../utils/types';
import { getReq } from '../../api/api';
import { getUserInfoUri, userId, getUserAvatarUri } from '../../api/requestData';
import { useAppDispatch } from '../../services/reduxHooks';
import { setUserData, setUserPhoto } from '../../services/userSlice';
import Game from '../../pages/Game/Game';
import Loader from '../Loader/Loader';
import OpenedRooms from '../../pages/OpenedRooms/OpenedRooms';

const App: FC = () => {
  const { tg, user } = useTelegram();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    tg.ready();
    tg.setHeaderColor('#d51845');
    tg.expand();
    tg.isExpanded(true);
    tg.enableClosingConfirmation();
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const userDataResponse = await getReq<UserData>({ uri: getUserInfoUri, userId: user?.id });
        const userPhotoResponse = await getReq<any>({ uri: getUserAvatarUri, userId: user?.id });
        // const userDataResponse = await getReq<UserData>({ uri: getUserInfoUri, userId: userId });
        // const userPhotoResponse = await getReq<any>({ uri: getUserAvatarUri, userId: userId });
        dispatch(setUserData(userDataResponse));
        console.log(userDataResponse.info);
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
      {loading ?  <Loader /> : (
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

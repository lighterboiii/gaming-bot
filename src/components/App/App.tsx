/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Routes, Route } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import styles from './App.module.scss';
import CreateRoom from '../../pages/CreateRoom/CreateRoom';
import Main from '../../pages/Main/Main';
import Rooms from '../../pages/Rooms/Rooms';
import Shop from '../../pages/Shop/Shop';
import useTelegram from '../../hooks/useTelegram';
import LeaderBoard from '../../pages/LeaderBoard/LeaderBoard';
import { createRoomUrl, indexUrl, leaderboardUrl, roomsUrl, shopUrl } from '../../utils/routes';
import { UserData } from '../../utils/types';
import { getReq } from '../../api/api';
import { getUserInfoUri, getUserPhotoUri, userId } from '../../api/requestData';
import { useAppDispatch } from '../../services/reduxHooks';
import { setUserData, setUserPhoto } from '../../services/userSlice';
import Game from '../../pages/Game/Game';

const App: FC = () => {
  const { tg, user } = useTelegram();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    tg.ready();
    tg.setHeaderColor('#d51845');
    tg.expand();
    tg.enableClosingConfirmation();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        const userDataResponse = await getReq<UserData>({ uri: getUserInfoUri, userId: user?.id });
        // const userDataResponse = await getReq<UserData>({ uri: getUserInfoUri, userId: userId });
        // const userPhotoResponse = await getReq<any>({ uri: getUserPhotoUri, userId: userId });
        dispatch(setUserData(userDataResponse));
        setLoading(false);
      } catch (error) {
        console.error('Ошибка в получении данных пользователя:' + error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className={styles.app}>
      {loading ?  <div>Загрузка...</div> : (
      <Routes>
      <Route path={indexUrl} element={<Main />} />
      <Route path={roomsUrl} element={<Rooms />} />
      <Route path={createRoomUrl} element={<CreateRoom />} />
      <Route path={shopUrl} element={<Shop />} />
      <Route path={leaderboardUrl} element={<LeaderBoard />} />
      {/* <Route path='/game' element={<Game />} /> */}
    </Routes>
      )
}
    </div>
  );
}

export default App;

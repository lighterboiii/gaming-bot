/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Routes, Route } from 'react-router-dom';
import { FC, useEffect } from 'react';
import styles from './App.module.scss';
import Balance from '../../pages/Balance/Balance';
import CreateRoom from '../../pages/CreateRoom/CreateRoom';
import Main from '../../pages/Main/Main';
import Rooms from '../../pages/Rooms/Rooms';
import Shop from '../../pages/Shop/Shop';
import useTelegram from '../../hooks/useTelegram';
import LeaderBoard from '../../pages/LeaderBoard/LeaderBoard';
import { balanceUrl, createRoomUrl, indexUrl, leaderboardUrl, roomsUrl, shopUrl } from '../../utils/routes';
import { UserData } from '../../utils/types';
import { getReq } from '../../api/api';
import { getUserInfoUri, getUserPhotoUri, userId } from '../../api/requestData';
import { useAppDispatch } from '../../services/reduxHooks';
import { setUserData, setUserPhoto } from '../../services/userSlice';

const App: FC = () => {
  const { tg, user } = useTelegram();
  const dispatch = useAppDispatch();

  useEffect(() => {
    tg.ready()
    tg.expand();
    tg.enableClosingConfirmation();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataResponse = await getReq<UserData>({ uri: getUserInfoUri, userId: user?.id });
        // const userPhotoResponse = await getReq<any>({ uri: getUserPhotoUri, userId: userId });
        dispatch(setUserData(userDataResponse));
        // console.log(userPhotoResponse.info);
        // dispatch(setUserPhoto(userPhotoResponse.info));

      } catch (error) {
        console.error('Ошибка в получении данных пользователя:' + error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className={styles.app}>
      <Routes>
        <Route path={indexUrl} element={<Main />} />
        <Route path={roomsUrl} element={<Rooms />} />
        <Route path={createRoomUrl} element={<CreateRoom />} />
        <Route path={shopUrl} element={<Shop />} />
        <Route path={balanceUrl} element={<Balance />} />
        <Route path={leaderboardUrl} element={<LeaderBoard />} />
      </Routes>
    </div>
  );
}

export default App;

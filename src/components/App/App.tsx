import { Routes, Route } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import styles from './App.module.scss';
import Balance from '../../pages/Balance/Balance';
import CreateRoom from '../../pages/CreateRoom/CreateRoom';
import Main from '../../pages/Main/Main';
import Rooms from '../../pages/Rooms/Rooms';
import Shop from '../../pages/Shop/Shop';
import useTelegram from '../../hooks/useTelegram';
import LeaderBoard from '../../pages/LeaderBoard/LeaderBoard';
import { balanceUrl, createRoomUrl, indexUrl, leaderboardUrl, roomsUrl, shopUrl } from '../../utils/routes';
import { getData } from '../../api/api';
import { UserData } from '../../utils/types';

const App: FC = () => {
  const { tg } = useTelegram();
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    tg.ready()
    tg.expand();
    tg.enableClosingConfirmation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(data?.info);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getData();
        setData(info);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
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

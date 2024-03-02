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

const App: FC = () => {
  const [j, setJ] = useState('');
  const { tg } = useTelegram();
  useEffect(() => {
    tg.ready()
    tg.expand();
    tg.enableClosingConfirmation();
    const photo = tg.user?.photo_url;
    setJ(photo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.app}>
      <img src={j} alt="" />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/rooms' element={<Rooms />} />
        <Route path='/create-room' element={<CreateRoom />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/balance' element={<Balance />} />
        <Route path='/leaderboard' element={<LeaderBoard />} />
      </Routes>
    </div>
  );
}

export default App;

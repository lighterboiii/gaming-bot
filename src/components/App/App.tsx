import { Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import styles from './App.module.scss';
import Balance from '../../pages/Balance/Balance';
import CreateRoom from '../../pages/CreateRoom/CreateRoom';
import Main from '../../pages/Main/Main';
import Rooms from '../../pages/Rooms/Rooms';
import Shop from '../../pages/Shop/Shop';

const App: FC = () => {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/rooms' element={<Rooms />} />
        <Route path='/create-room' element={<CreateRoom />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/balance' element={<Balance />} />
      </Routes>
    </div>
  );
}

export default App;

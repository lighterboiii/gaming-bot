import { FC } from "react";
import styles from './OpenedRooms.module.scss';

const OpenedRooms: FC = () => {
  return (
    <div className={styles.rooms}>
      <h2 className={styles.rooms__heading}>Найти игру</h2>
      <div className={styles.rooms__content}>
        <select className={styles.rooms__select} id="select" value="bet">
          <option value="bet">по ставке</option>
          <option value="type">по типу игры</option>
        </select>
        <div className={styles.rooms__roomList}>
          <p>Комната 1</p>
        </div>
      </div>
    </div>
  )
};

export default OpenedRooms;
import { FC } from "react";
import styles from './OpenedRooms.module.scss';

const OpenedRooms: FC = () => {
  return (
  <div className={styles.rooms}>
    <h2 className={styles.rooms__heading}>Найти игру</h2>
  </div>
  )
}

export default OpenedRooms;
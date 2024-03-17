/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";
import styles from './OpenedRooms.module.scss';
import useTelegram from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";

const OpenedRooms: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  
  useEffect(() => {
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, []);

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
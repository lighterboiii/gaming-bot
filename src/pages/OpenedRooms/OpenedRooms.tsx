/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";
import styles from './OpenedRooms.module.scss';
import useTelegram from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import { openedRooms } from "../../utils/mockData";
import Room from "../../components/Game/Room/Room";

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
        <div className={styles.rooms__buttons}>
          <button className={styles.rooms__button}>
            <p className={styles.rooms__game}>Игра</p>
            <p className={styles.rooms__name}>Цу-е-фа</p>
          </button>
          <button className={styles.rooms__button}>
            <p className={styles.rooms__game}>Валюта</p>
            <p className={styles.rooms__name}>Все</p>
          </button>
          <button className={styles.rooms__button}>
            <p className={styles.rooms__game}>Ставка</p>
            <p className={styles.rooms__name}>Возрастание</p>
          </button>
        </div>
        <div className={styles.rooms__roomList}>
          {openedRooms.map((room: any) => (
            <Room room={room} />
          ))}
        </div>
      </div>
    </div>
  )
};

export default OpenedRooms;
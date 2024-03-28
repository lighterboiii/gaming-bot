/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import styles from './OpenedRooms.module.scss';
import useTelegram from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import { openedRooms } from "../../utils/mockData";
import Room from "../../components/Game/Room/Room";
import { getReq } from "../../api/api";
// типизировать
const OpenedRooms: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any>(null);
  const [typeValue, setTypeValue] = useState('Все');
  const [currencyValue, setCurrencyValue] = useState('Все');
  const [betValue, setBetValue] = useState('Все');

  const [sortByBetAsc, setSortByBetAsc] = useState(false);
  const [sortByType, setSortByType] = useState(false);
  const [sortByCurr, setSortByCurr] = useState(false);

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const res = await getReq({
          uri: 'getrooms',
          userId: '',
        })
        console.log(res)
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoomsData();
    setRooms(openedRooms);
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, []);
  // сортировка по размеру ставки
  const sortRoomsByBet = (rooms: any[]) => {
    return rooms.slice().sort((a, b) => {
      if (sortByBetAsc) {
        return a.bet - b.bet;
      } else {
        return b.bet - a.bet;
      }
    });
  };
  // сортировка по типу игры
  const sortRoomsByGameType = (rooms: any[]) => {
    return rooms.slice().sort((a, b) => {
      if (sortByType) {
        return a.gameType.localeCompare(b.gameType);
      } else {
        return b.gameType.localeCompare(a.gameType);
      }
    });
  };
  const sortRoomsByCurrency = (rooms: any[]) => {
    return rooms.slice().sort((a, b) => {
      if (sortByCurr) {
        return a.currency.localeCompare(b.currency);
      } else {
        return b.currency.localeCompare(a.currency);
      }
    });
  };
  // функции сортировки
  const toggleSortByBet = () => {
    const sortedRooms = sortRoomsByBet(openedRooms);
    setRooms(sortedRooms);
    setSortByBetAsc(!sortByBetAsc);
    if (sortByBetAsc === true) {
      setBetValue("Возрастание");
    } else {
      setBetValue("Убывание");
    }
  };
  const toggleSortByType = () => {
    const sortedRooms = sortRoomsByGameType(openedRooms);
    setRooms(sortedRooms);
    setSortByType(!sortByType);
    if (sortByType === true) {
      setTypeValue("Кто ближе");
    } else {
      setTypeValue("Цу-е-фа");
    }
  };
  const toggleSortByCurrency = () => {
    const sortedRooms = sortRoomsByCurrency(openedRooms);
    setRooms(sortedRooms);
    setSortByCurr(!sortByCurr);
    if (sortByCurr === true) {
      setCurrencyValue("💵");
    } else {
      setCurrencyValue("🔰");
    }
  };

  return (
    <div className={styles.rooms + ' scrollable'}>
      <div className={styles.rooms__content}>
        <h2 className={styles.rooms__heading}>Найти игру</h2>
        <div className={styles.rooms__buttons}>
          <button type="button" name="type" className={styles.rooms__button} onClick={toggleSortByType}>
            <p className={styles.rooms__game}>Игра</p>
            <p className={styles.rooms__name}>{typeValue}</p>
          </button>
          <button type="button" name="currency" className={styles.rooms__button} onClick={toggleSortByCurrency}>
            <p className={styles.rooms__game}>Валюта</p>
            <p className={styles.rooms__name}>{currencyValue}</p>
          </button>
          <button type="button" name="bet" className={styles.rooms__button} onClick={toggleSortByBet}>
            <p className={styles.rooms__game}>Ставка</p>
            <p className={styles.rooms__name}>{betValue}</p>
          </button>
        </div>
      </div>
      <div className={styles.rooms__roomList + " scrollable"}>
        {rooms?.map((room: any) => (
          <Room room={room} />
        ))}
      </div>
    </div>
  )
};

export default OpenedRooms;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import styles from './OpenedRooms.module.scss';
import useTelegram from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import Room from "../../components/Game/Room/Room";
import { getReq } from "../../api/api";
import { useAppDispatch } from "../../services/reduxHooks";
import { getOpenedRooms } from "../../services/appSlice";
import { sortRooms } from "../../utils/additionalFunctions";
import { postEvent } from "@tma.js/sdk";
import Loader from "../../components/Loader/Loader";
import { getOpenedRoomsRequest } from "../../api/gameApi";
import Button from "../../components/ui/Button/Button";
// типизировать
const OpenedRooms: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const [rooms, setRooms] = useState<any>(null);
  const [typeValue, setTypeValue] = useState('Все');
  const [currencyValue, setCurrencyValue] = useState('Все');
  const [betValue, setBetValue] = useState('Все');

  const [sortByBetAsc, setSortByBetAsc] = useState(false);
  const [sortByType, setSortByType] = useState(false);
  const [sortByCurr, setSortByCurr] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchRoomsData = () => {
      getOpenedRoomsRequest()
        .then((res: any) => {
          setRooms(res.rooms);
          dispatch(getOpenedRooms(res.rooms));
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchRoomsData();
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, []);

  const toggleSort = (sortBy: string) => {
    let sortedRooms;
    switch (sortBy) {
      case 'type':
        sortedRooms = sortRooms(rooms, 'gameType', sortByType);
        setSortByType(!sortByType);
        setTypeValue(sortByType ? 'Кто ближе' : 'Цу-е-фа');
        break;
      case 'currency':
        sortedRooms = sortRooms(rooms, 'currency', sortByCurr);
        setSortByCurr(!sortByCurr);
        setCurrencyValue(sortByCurr ? '💵' : '🔰');
        break;
      case 'bet':
        sortedRooms = sortRooms(rooms, 'bet', sortByBetAsc);
        setSortByBetAsc(!sortByBetAsc);
        setBetValue(sortByBetAsc ? 'Возрастание' : 'Убывание');
        break;
      default:
        // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
        sortedRooms = rooms;
    }
    setRooms(sortedRooms);
  };

  return (
    <div className={styles.rooms}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.rooms__content}>
            <h2 className={styles.rooms__heading}>Найти игру</h2>
            <div className={styles.rooms__buttons}>
              <button type="button" name="type" className={styles.rooms__button} onClick={() => toggleSort('type')}>
                <p className={styles.rooms__game}>Игра</p>
                <p className={styles.rooms__name}>{typeValue}</p>
              </button>
              <button type="button" name="currency" className={styles.rooms__button} onClick={() => toggleSort('currency')}>
                <p className={styles.rooms__game}>Валюта</p>
                <p className={styles.rooms__name}>{currencyValue}</p>
              </button>
              <button type="button" name="bet" className={styles.rooms__button} onClick={() => toggleSort('bet')}>
                <p className={styles.rooms__game}>Ставка</p>
                <p className={styles.rooms__name}>{betValue}</p>
              </button>
            </div>
          </div>
          <div className={styles.rooms__roomList + " scrollable"}>
            {rooms && rooms.length > 0 ? rooms?.map((room: any) => (
              <Room room={room} />
            )) : (
              <div className={styles.rooms__createNew}>
                <p className={styles.rooms__notify}>Нет открытых комнат, создай первую</p>
                <div className={styles.rooms__buttonWrapper}>
                  <Button handleClick={() => navigate('/create-room')} text="Cоздать 🚀" />
                </div>
              </div>

            )
            }
          </div>
        </>
      )}
    </div>
  )
};

export default OpenedRooms;
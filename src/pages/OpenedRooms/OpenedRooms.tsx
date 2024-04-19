/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import styles from './OpenedRooms.module.scss';
import useTelegram from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import Room from "../../components/Game/Room/Room";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { getOpenedRooms } from "../../services/appSlice";
import { sortRooms } from "../../utils/additionalFunctions";
import { postEvent } from "@tma.js/sdk";
import Loader from "../../components/Loader/Loader";
import { getOpenedRoomsRequest } from "../../api/gameApi";
import Button from "../../components/ui/Button/Button";
import { IGameCardData } from "../../utils/types/gameTypes";
import CreateRoomFooter from "../../components/CreateRoomFooter/CreateRoomFooter";
import { Modal } from "../../components/Modal/Modal";
import energy from '../../images/energy-drink.png';
// типизировать
const OpenedRooms: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const translation = useAppSelector(store => store.app.languageSettings);
  const userInfo = useAppSelector(store => store.app.info);
  const [rooms, setRooms] = useState<IGameCardData[] | null>(null);
  const [typeValue, setTypeValue] = useState(`${translation?.sort_all}`);
  const [currencyValue, setCurrencyValue] = useState(`${translation?.sort_all}`);
  const [betValue, setBetValue] = useState(`${translation?.sort_all}`);
  const [isModalOpen, setModalOpen] = useState(false);
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      getOpenedRoomsRequest()
        .then((res: any) => {
          setRooms(res.rooms);
          dispatch(getOpenedRooms(res.rooms));
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleSort = (sortBy: string) => {
    let sortedRooms;
    switch (sortBy) {
      case 'type':
        sortedRooms = sortRooms(rooms as any, 'gameType', sortByType);
        setSortByType(!sortByType);
        setTypeValue(sortByType ? `${translation?.closest_number}` : `${translation?.rock_paper_scissors}`);
        break;
      case 'currency':
        sortedRooms = sortRooms(rooms as any, 'currency', sortByCurr);
        setSortByCurr(!sortByCurr);
        setCurrencyValue(sortByCurr ? '💵' : '🔰');
        break;
      case 'bet':
        sortedRooms = sortRooms(rooms as any, 'bet', sortByBetAsc);
        setSortByBetAsc(!sortByBetAsc);
        setBetValue(sortByBetAsc ? `${translation?.sort_ascending}` : `${translation?.sort_descending}`);
        break;
      default:
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
        sortedRooms = rooms;
    }
    setRooms(sortedRooms);
  };

  return (
    <div className={styles.rooms}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.rooms__content}>
            <h2 className={styles.rooms__heading}>{translation?.find_game}</h2>
            <div className={styles.rooms__buttons}>
              <button type="button" name="type" className={styles.rooms__button} onClick={() => toggleSort('type')}>
                <p className={styles.rooms__game}>{translation?.sort_game}</p>
                <p className={styles.rooms__name}>{typeValue}</p>
              </button>
              <button type="button" name="currency" className={styles.rooms__button} onClick={() => toggleSort('currency')}>
                <p className={styles.rooms__game}>{translation?.sort_currency}</p>
                <p className={styles.rooms__name}>{currencyValue}</p>
              </button>
              <button type="button" name="bet" className={styles.rooms__button} onClick={() => toggleSort('bet')}>
                <p className={styles.rooms__game}>{translation?.sort_bet}</p>
                <p className={styles.rooms__name}>{betValue}</p>
              </button>
            </div>
          </div>
          <div className={styles.rooms__roomList + " scrollable"}>
            {rooms && rooms.length > 0 ? rooms?.map((room: any, index: number) => (
              <Room room={room} key={index} />
            )) : (
              <div className={styles.rooms__createNew}>
                <p className={styles.rooms__notify}>{translation?.no_open_rooms}</p>
                <div className={styles.rooms__buttonWrapper}>
                  <Button handleClick={() => navigate('/create-room')} text={translation?.create_room_button} />
                </div>
              </div>

            )
            }
          </div>
        </>
      )}
      {rooms && rooms?.length > 0 && <CreateRoomFooter openModal={() => setModalOpen(true)} />}
      {isModalOpen && (
        <Modal title={"Закончилась энергия!"} closeModal={() => setModalOpen(false)}>
          <div className={styles.rooms__modalChildren}>
            <p className={styles.rooms__modalText}>
              Хотите использовать?
              <img src={energy} alt="drink" className={styles.rooms__logoDrink} />
            </p>
            <p className={styles.rooms__modalText}>(1/{userInfo?.user_energy_drinks})</p>
          </div>
          <div className={styles.rooms__buttons}>
            <div className={styles.rooms__modalButtonWrapper}>
              <Button text="Нет" handleClick={() => {setModalOpen(false)}}/>
            </div>
            <div className={styles.rooms__modalButtonWrapper}>
              <Button text="Да" handleClick={() => {navigate('/create-room')}}/>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
};

export default OpenedRooms;
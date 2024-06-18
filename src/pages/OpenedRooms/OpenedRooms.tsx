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
import { IGameCardData, IRPSGameData } from "../../utils/types/gameTypes";
import CreateRoomFooter from "../../components/Game/CreateRoomFooter/CreateRoomFooter";
import { Modal } from "../../components/Modal/Modal";
import JoinRoomPopup from "../../components/Game/JoinRoomPopup/JoinRoomPopup";

const OpenedRooms: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const translation = useAppSelector(store => store.app.languageSettings);
  const [rooms, setRooms] = useState<IGameCardData[] | null>(null);
  const [typeValue, setTypeValue] = useState(`${translation?.sort_all}`);
  const [currencyValue, setCurrencyValue] = useState(`${translation?.sort_all}`);
  const [betValue, setBetValue] = useState(`${translation?.sort_all}`);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sortByBetAsc, setSortByBetAsc] = useState(false);
  const [sortByType, setSortByType] = useState(false);
  const [sortByCurr, setSortByCurr] = useState(false);
  const [typeClickCount, setTypeClickCount] = useState(0);
  const [currencyClickCount, setCurrencyClickCount] = useState(0);
  const [betClickCount, setBetClickCount] = useState(0);

  const [loading, setLoading] = useState(false);
  
  const [selectedRoom, setSelectedRoom] = useState<IRPSGameData | null>(null);

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

  const applySort = (rooms: IGameCardData[]) => {
    if (typeClickCount > 0) {
      rooms = sortRooms(rooms, 'gameType', sortByType);
    }
    if (currencyClickCount > 0) {
      rooms = sortRooms(rooms, 'currency', sortByCurr);
    }
    if (betClickCount > 0) {
      rooms = sortRooms(rooms, 'bet', sortByBetAsc);
    }
    setRooms(rooms);
  };

  const toggleSort = (sortBy: string) => {
    let sortedRooms;
  
    switch (sortBy) {
      case 'type':
        setTypeClickCount((prevCount) => {
          const newCount = (prevCount + 1) % 3;
          if (newCount === 0) {
            setTypeValue(`${translation?.sort_all}`);
            setSortByType(false);
          } else {
            sortedRooms = sortRooms(rooms as any, 'gameType', sortByType);
            setSortByType(!sortByType);
            setTypeValue(sortByType ? `${translation?.rock_paper_scissors}` : `${translation?.closest_number}`);
            setRooms(sortedRooms);
          }
          return newCount;
        });
        break;
  
      case 'currency':
        setCurrencyClickCount((prevCount) => {
          const newCount = (prevCount + 1) % 3;
          if (newCount === 0) {
            setCurrencyValue(`${translation?.sort_all}`);
            setSortByCurr(false);
          } else {
            sortedRooms = sortRooms(rooms as any, 'currency', sortByCurr);
            setSortByCurr(!sortByCurr);
            setCurrencyValue(sortByCurr ? '🔰' : '💵');
            setRooms(sortedRooms);
          }
          return newCount;
        });
        break;
  
      case 'bet':
        setBetClickCount((prevCount) => {
          const newCount = (prevCount + 1) % 3;
          if (newCount === 0) {
            setBetValue(`${translation?.sort_all}`);
            setSortByBetAsc(false);
          } else {
            sortedRooms = sortRooms(rooms as any, 'bet', sortByBetAsc);
            setSortByBetAsc(!sortByBetAsc);
            setBetValue(sortByBetAsc ? `${translation?.sort_descending}` : `${translation?.sort_ascending}`);
            setRooms(sortedRooms);
          }
          return newCount;
        });
        break;
  
      default:
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });
        sortedRooms = rooms;
    }
  };

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setModalOpen(true);
  }

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
              <Room room={room} key={index} openModal={() => handleRoomClick(room)} />
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
      {rooms && rooms?.length > 0 && <CreateRoomFooter />}
      {isModalOpen && selectedRoom && (
        <Modal title={translation?.energy_depleted} closeModal={() => setModalOpen(false)}>
          <JoinRoomPopup handleClick={() => setModalOpen(false)} room={selectedRoom} />
        </Modal>
      )}
    </div>
  )
};

export default OpenedRooms;
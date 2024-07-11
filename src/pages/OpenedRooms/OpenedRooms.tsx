/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getOpenedRoomsRequest } from "API/gameApi";
import CreateRoomFooter from "Components/Game/CreateRoomFooter/CreateRoomFooter";
import JoinRoomPopup from "Components/Game/JoinRoomPopup/JoinRoomPopup";
import Room from "Components/Game/Room/Room";
import Loader from "Components/Loader/Loader";
import { Modal } from "Components/Modal/Modal";
import Button from "Components/ui/Button/Button";
import useTelegram from "Hooks/useTelegram";
import { getOpenedRooms } from "Services/appSlice";
import { useAppDispatch, useAppSelector } from "Services/reduxHooks";
import { sortRooms } from "Utils/additionalFunctions";
import { indexUrl } from "Utils/routes";
import { IGameCardData } from "Utils/types/gameTypes";

import styles from './OpenedRooms.module.scss';

export const OpenedRooms: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
  console.log(rooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

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
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(indexUrl);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, [dispatch, navigate, tg.BackButton]);

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
  }, [dispatch]);

  const toggleSort = (sortBy: string) => {
    let sortedRooms;

    switch (sortBy) {
      case 'type':
        setCurrencyClickCount(0);
        setCurrencyValue(`${translation?.sort_all}`);
        setSortByCurr(false);

        setBetClickCount(0);
        setBetValue(`${translation?.sort_all}`);
        setSortByBetAsc(false);

        setTypeClickCount((prevCount) => {
          const newCount = (prevCount + 1) % 3;
          if (newCount === 0) {
            setTypeValue(`${translation?.sort_all}`);
            setSortByType(false);
          } else {
            sortedRooms = sortRooms(rooms as any, 'room_type', sortByType);
            setSortByType(!sortByType);
            setTypeValue(sortByType ? `${translation?.rock_paper_scissors}` : `${translation?.closest_number}`);
            setRooms(sortedRooms);
          }
          return newCount;
        });
        break;

      case 'currency':
        setTypeClickCount(0);
        setTypeValue(`${translation?.sort_all}`);
        setSortByType(false);

        setBetClickCount(0);
        setBetValue(`${translation?.sort_all}`);
        setSortByBetAsc(false);

        setCurrencyClickCount((prevCount) => {
          const newCount = (prevCount + 1) % 3;
          if (newCount === 0) {
            setCurrencyValue(`${translation?.sort_all}`);
            setSortByCurr(false);
          } else {
            sortedRooms = sortRooms(rooms as any, 'bet_type', sortByCurr);
            setSortByCurr(!sortByCurr);
            setCurrencyValue(sortByCurr ? '💵' : '🔰');
            setRooms(sortedRooms);
          }
          return newCount;
        });
        break;

      case 'bet':
        setTypeClickCount(0);
        setTypeValue(`${translation?.sort_all}`);
        setSortByType(false);

        setCurrencyClickCount(0);
        setCurrencyValue(`${translation?.sort_all}`);
        setSortByCurr(false);

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
        sortedRooms = rooms;
        // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
    }
  };

  const handleRoomClick = (room: any) => {
    if (room?.free_places === 0) {
      return;
    }
    setSelectedRoomId(room?.room_id);
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
    navigate('/create-room')
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
              <button type="button"
                name="currency"
                className={styles.rooms__button}
                onClick={() => toggleSort('currency')}
              >
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
                  <Button handleClick={handleCreateClick} text={translation?.create_room_button} />
                </div>
              </div>

            )
            }
          </div>
        </>
      )}
      {rooms && rooms?.length > 0 && <CreateRoomFooter />}
      {isModalOpen && selectedRoomId && (
        <Modal title={translation?.energy_depleted} closeModal={() => setModalOpen(false)}>
          <JoinRoomPopup
            handleClick={() => setModalOpen(false)}
            roomId={selectedRoomId}
          />
        </Modal>
      )}
    </div>
  )
};


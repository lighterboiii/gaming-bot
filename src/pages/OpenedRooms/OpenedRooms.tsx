/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { WebSocketContext } from "socket/WebSocketContext";
import { getUserId } from "utils/userConfig";

import CreateRoomFooter from "../../components/Game/CreateRoomFooter/CreateRoomFooter";
import JoinRoomPopup from "../../components/Game/JoinRoomPopup/JoinRoomPopup";
import Room from "../../components/Game/Room/Room";
import RoomSkeleton from "../../components/Game/RoomSkeleton/RoomSkeleton";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/ui/Button/Button";
import useTelegram from "../../hooks/useTelegram";
import { useAppSelector } from "../../services/reduxHooks";
import { sortRooms } from "../../utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "../../utils/constants";
import { triggerHapticFeedback } from "../../utils/hapticConfig";
import { indexUrl } from "../../utils/routes";
import { IGameCardData } from "../../utils/types/gameTypes";

import styles from "./OpenedRooms.module.scss";

export const OpenedRooms: FC = () => {
  const userId = getUserId();
  const navigate = useNavigate();
  const translation = useAppSelector((store) => store.app.languageSettings);
  const [rooms, setRooms] = useState<IGameCardData[] | null>(null);
  const [originalRooms, setOriginalRooms] = useState<IGameCardData[] | null>(null);
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
  const { sendMessage, wsMessages } =
    useContext(WebSocketContext)!;
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { tg } = useTelegram();

  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(indexUrl);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor("#d51845");
    };
  }, []);

  useEffect(() => {
    sendMessage({
      user_id: userId,
      type: "get_rooms",
    });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleWebSocketMessage = (message: string) => {
      const res = JSON.parse(message);
      if (res.type === "rooms_update") {
        const filteredRooms = res.rooms.filter((room: any) => Number(room.room_type) !== 4);
        setRooms(filteredRooms);
        setOriginalRooms(filteredRooms);
      }
    };

    if (wsMessages.length > 0) {
      const lastMessage = wsMessages[wsMessages.length - 1];
      handleWebSocketMessage(lastMessage);
    }
  }, [wsMessages]);

  const toggleSort = (sortBy: string) => {
    let sortedRooms;

    switch (sortBy) {
      case "type":
        setLoading(true);
        triggerHapticFeedback("impact", "soft");
        setCurrencyClickCount(0);
        setCurrencyValue(`${translation?.sort_all}`);
        setSortByCurr(false);

        setBetClickCount(0);
        setBetValue(`${translation?.sort_all}`);
        setSortByBetAsc(false);

        setTypeClickCount((prevCount) => {
          const newCount = (prevCount + 1) % 4;
          if (newCount === 0) {
            setTypeValue(`${translation?.sort_all}`);
            setSortByType(!sortByType);
            setRooms([...originalRooms!]);
          } else {
            const targetType =
              newCount === 1 ? 1 : newCount === 2 ? 2 : 3;

            sortedRooms = originalRooms!.filter((room) => Number(room.room_type) === targetType);
            setRooms(sortedRooms);

            setTypeValue(newCount === 1
                ? `${translation?.rock_paper_scissors_short}`
                : newCount === 2
                ? `${translation?.closest_number_short}`
                : `${translation?.ludka_short}`);
          }
          return newCount;
        });

        setTimeout(() => {
          setLoading(false);
        }, 300);
        break;

      case "currency":
        triggerHapticFeedback("impact", "soft");
        setBetClickCount(0);
        setBetValue(`${translation?.sort_all}`);
        setSortByBetAsc(false);

        setCurrencyClickCount((prevCount) => {
          const newCount = (prevCount + 1) % 3;
          if (newCount === 0) {
            setCurrencyValue(`${translation?.sort_all}`);
            setSortByCurr(false);
            setRooms([...rooms!]);
          } else {
            sortedRooms = sortRooms(rooms as any, "bet_type", sortByCurr);
            setSortByCurr(!sortByCurr);
            setCurrencyValue(sortByCurr ? MONEY_EMOJI : SHIELD_EMOJI);
            setRooms(sortedRooms);
          }
          return newCount;
        });
        break;

      case "bet":
        triggerHapticFeedback("impact", "soft");
        setCurrencyClickCount(0);
        setCurrencyValue(`${translation?.sort_all}`);
        setSortByCurr(false);

        setBetClickCount((prevCount) => {
          const newCount = (prevCount + 1) % 3;
          if (newCount === 0) {
            setBetValue(`${translation?.sort_all}`);
            setSortByBetAsc(false);
            setRooms([...rooms!]);
          } else {
            sortedRooms = sortRooms(rooms as any, "bet", sortByBetAsc);
            setSortByBetAsc(!sortByBetAsc);
            setBetValue(sortByBetAsc
                ? `${translation?.sort_descending}`
                : `${translation?.sort_ascending}`);
            setRooms(sortedRooms);
          }
          return newCount;
        });
        break;

      default:
        sortedRooms = rooms;
    }
  };

  const handleRoomClick = (room: any) => {
    if (room?.free_places === 0) {
      triggerHapticFeedback("impact", "light");
      return;
    }
    setSelectedRoomId(room?.room_id);
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    triggerHapticFeedback("notification", "success");
    navigate("/create-room");
  };

  // if (!isPortrait) {
  //   return <Warning />;
  // }

  return (
    <main className={styles.rooms}>
      <header className={styles.rooms__content}>
        <h2 className={styles.rooms__heading}>{translation?.find_game}</h2>
        <div className={styles.rooms__buttons}>
          <button
            aria-pressed={sortByType}
            className={`${styles.rooms__button} ${
              sortByType ? styles.activeButton : ""
            }`}
            onClick={() => toggleSort("type")}
            disabled={!originalRooms?.length}
          >
            <span className={styles.rooms__game}>{translation?.sort_game}</span>
            <span className={styles.rooms__name}>{typeValue}</span>
          </button>
          <button
            type="button"
            name="currency"
            className={styles.rooms__button}
            onClick={() => toggleSort("currency")}
            disabled={!originalRooms?.length}
          >
            <span className={styles.rooms__game}>
              {translation?.sort_currency}
            </span>
            <span className={styles.rooms__name}>{currencyValue}</span>
          </button>
          <button
            type="button"
            name="bet"
            className={styles.rooms__button}
            onClick={() => toggleSort("bet")}
            disabled={!originalRooms?.length}
          >
            <span className={styles.rooms__game}>{translation?.sort_bet}</span>
            <span className={styles.rooms__name}>{betValue}</span>
          </button>
        </div>
      </header>
      <section className={styles.rooms__roomList + " scrollable"}>
        {loading && rooms?.length ? (
          <>
            <RoomSkeleton />
            <RoomSkeleton />
            <RoomSkeleton />
            <RoomSkeleton />
            <RoomSkeleton />
          </>
        ) : rooms && rooms.length > 0 ? (
          rooms?.map((room: any, index: number) => (
            <Room
              room={room}
              key={index}
              openModal={() => handleRoomClick(room)}
            />
          ))
        ) : (
          <div className={styles.rooms__createNew}>
            <p className={styles.rooms__notify}>{translation?.no_open_rooms}</p>
            <div className={styles.rooms__buttonWrapper}>
              <Button
                handleClick={handleCreateClick}
                text={translation?.create_room_button}
              />
            </div>
          </div>
        )}
      </section>
      {rooms && rooms?.length > 0 && (
        <footer>
          <CreateRoomFooter />
        </footer>
      )}
      {isModalOpen && selectedRoomId && (
        <Modal
          title={translation?.energy_depleted}
          closeModal={() => setModalOpen(false)}
        >
          <JoinRoomPopup
            handleClick={() => setModalOpen(false)}
            roomId={selectedRoomId}
          />
        </Modal>
      )}
    </main>
  );
};

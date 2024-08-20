/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { energyDrinkRequest, joinRoomRequest, postNewRoomRequest } from "../../../api/gameApi";
import { userId } from '../../../api/requestData';
import useTelegram from "../../../hooks/useTelegram";
import energy from '../../../images/energy-drink.png';
import { useAppSelector } from "../../../services/reduxHooks";
import Button from "../../ui/Button/Button";

import styles from './JoinRoomPopup.module.scss';

interface IProps {
  handleClick: () => void;
  fromGameSettings?: boolean;
  roomId: string;
  bet?: number;
  betType?: number;
  roomType?: number;
}

const JoinRoomPopup: FC<IProps> = ({
  handleClick,
  roomId,
  bet,
  betType,
  roomType,
  fromGameSettings = false,
}) => {
  const { user } = useTelegram();
  const userId = user?.id;
  const [messageShown, setMessageShown] = useState(false);
  const navigate = useNavigate();
  const userInfo = useAppSelector(store => store.app.info);
  const translation = useAppSelector(store => store.app.languageSettings);
  const handleJoinRoom = () => {
    energyDrinkRequest(userId)
      .then((res: any) => {
        if (res?.message === 'ok') {
          if (fromGameSettings) {
            postNewRoomRequest({
              user_id: userId,
              bet: bet,
              bet_type: betType,
              room_type: roomType
            }, userId)
              .then((res: any) => {
                postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success' });
                navigate(Number(roomType) === 2 ? `/closest/${res.room_id}` : `/room/${res.room_id}`);
              })
              .catch((error) => {
                console.error("Error creating room:", error);
              });
          } else {
            joinRoomRequest(userId, roomId)
              .then(res => {
                navigate(`/room/${roomId}`);
              })
              .catch((error) => {
                console.error("Error joining room:", error);
              });
          }
        } else {
          setMessageShown(true);
        }
      })
      .catch(error => {
        console.error("Error using drink", error)
      })
  };

  return (
    <div className={styles.popup}>
      {messageShown ? (
        <p className={styles.popup__modalText}>
          {translation?.not_energy_drinks}
        </p>
      ) : (
        <>
          <div className={styles.popup__modalChildren}>
            <p className={styles.popup__modalText}>
              {translation?.want2use_energy_drink}
              <img
                src={energy}
                alt="drink"
                className={styles.popup__logoDrink}
              />
            </p>
            <p className={styles.popup__modalText}>(1/{userInfo?.user_energy_drinks})</p>
          </div>
          <div className={styles.popup__buttons}>
            <div className={styles.popup__modalButtonWrapper}>
              <Button text={translation?.no}
                handleClick={() => handleClick()} />
            </div>
            <div className={styles.popup__modalButtonWrapper}>
              <Button text={translation?.yes}
                handleClick={() => handleJoinRoom()} />
            </div>
          </div>
        </>
      )}
    </div>
  )
};

export default JoinRoomPopup;

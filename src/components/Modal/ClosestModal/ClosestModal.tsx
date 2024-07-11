import { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

import { leaveRoomRequest } from "API/gameApi";
import { userId } from "API/requestData";
import useTelegram from "Hooks/useTelegram";
import { roomsUrl } from "Utils/routes";
import { IRPSPlayer } from "Utils/types/gameTypes";

import UserAvatar from "Components/User/UserAvatar/UserAvatar";
import ModalOverlay from "Components/Modal/ModalOverlay/ModalOverlay";

import styles from "./ClosestModal.module.scss";

interface IProps {
  closeModal: () => void;
  gameValue?: number;
  winnerValue?: number;
  winner?: IRPSPlayer;
  betType: string;
}

export const ClosestModal: FC<IProps> = ({ closeModal, winner, winnerValue, gameValue, betType }) => {
  const { user } = useTelegram();
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscClose = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    }
  }, [closeModal])

  const leaveRoom = () => {
    leaveRoomRequest(userId)
      .then(res => {
        navigate(roomsUrl);
      })
      .catch((error) => {
        console.log(error);
      })
  };

  return ReactDOM.createPortal(
    <>
      <div className={styles.modal}>
        <>
          <h3 className={styles.modal__title}>Победитель</h3>
          <div className={styles.modal__content}>
            <p className={styles.modal__text}>{gameValue}</p>
            <div className={styles.modal__avatar}>
              <UserAvatar item={winner}
                avatar={winner?.avatar} />
              <p className={styles.modal__name}>{winner?.publicname}</p>
            </div>
            <div className={styles.modal__winnerValue}>+ {winnerValue}   {betType === "1" ? `💵` : `🔰`}</div>
          </div>
        </>
      </div>
      <ModalOverlay closeModal={closeModal} />
    </>,
    document.getElementById('closest-root') as HTMLElement
  )
};

import { FC, useEffect } from "react";
import ReactDOM from "react-dom";
// import { useNavigate } from "react-router-dom";

// import { leaveRoomRequest } from "API/gameApi";
// import { userId } from "API/requestData";
import ModalOverlay from "Components/Modal/ModalOverlay/ModalOverlay";
import UserAvatar from "Components/User/UserAvatar/UserAvatar";
// import useTelegram from "Hooks/useTelegram";
// import { roomsUrl } from "Utils/routes";
import { IRPSPlayer } from "Utils/types/gameTypes";

import styles from "./ClosestModal.module.scss";

interface IProps {
  closeModal: () => void;
  gameValue?: number;
  winnerValue?: number;
  winner?: IRPSPlayer;
  betType: string;
  isTie?: boolean;
  tieWinners?: IRPSPlayer[];
}

export const ClosestModal: FC<IProps> = ({
  closeModal,
  winner,
  winnerValue,
  gameValue,
  betType,
  isTie,
  tieWinners
}) => {
  // const { user } = useTelegram();
  // const navigate = useNavigate();

  useEffect(() => {
    const handleEscClose = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [closeModal]);

  // const leaveRoom = () => {
  //   leaveRoomRequest(userId)
  //     .then(res => {
  //       navigate(roomsUrl);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  console.log(tieWinners);
  return ReactDOM.createPortal(
    <>
      <div className={styles.modal}>
        <h3 className={styles.modal__title}>{isTie ? "Победители" : "Победитель"}</h3>
        <div className={styles.modal__content}>
          {isTie ? (
            <div className={styles.modal__draw}>
              {tieWinners?.map((winner, index) => (
                <div className={styles.modal__tieContainer}>
                  <div key={index} className={styles.modal__drawatar}>
                    <UserAvatar item={winner} avatar={winner?.avatar} />
                  </div>
                  <div className={styles.modal__winnerValue}>
                    + {winnerValue} {betType === "1" ? `💵` : `🔰`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className={styles.modal__text}>{gameValue}</p>
              <div className={styles.modal__avatar}>
                <UserAvatar item={winner} avatar={winner?.avatar} />
                <p className={styles.modal__name}>{winner?.publicname}</p>
              </div>
              <div className={styles.modal__winnerValue}>
                + {winnerValue} {betType === "1" ? `💵` : `🔰`}
              </div>
            </>
          )}
        </div>
      </div>
      <ModalOverlay closeModal={closeModal} />
    </>,
    document.getElementById('closest-root') as HTMLElement
  );
};


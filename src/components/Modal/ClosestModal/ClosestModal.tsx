/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./ClosestModal.module.scss";
import ModalOverlay from "../ModalOverlay/ModalOverlay";
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import { leaveRoomRequest } from "../../../api/gameApi";
import useTelegram from "../../../hooks/useTelegram";
import { userId } from "../../../api/requestData";
import { useNavigate } from "react-router-dom";
import { roomsUrl } from "../../../utils/routes";

interface IProps {
  closeModal: () => void;
  gameValue?: number;
  winnerValue?: number;
  winner?: any;
}

export const ClosestModal: FC<IProps> = ({ closeModal, winner, winnerValue, gameValue }) => {
  const { user } = useTelegram();
  const navigate = useNavigate();
  console.log(winnerValue);
  const userId = user?.id;
  
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
        console.log(res);
        navigate(roomsUrl);
      })
      .catch((error) => {
        console.log(error);
      })
  };
  console.log(winner);
  return ReactDOM.createPortal(
    <>
      <div className={styles.modal}>
        {/* {Number(winner?.userid) !== Number(userId) ? ( */}
        <>
          <h3 className={styles.modal__title}>Победитель</h3>
          <div className={styles.modal__content}>
            <p className={styles.modal__text}>{gameValue}</p>
            <div className={styles.modal__avatar}>
              <UserAvatar item={winner} avatar={winner?.avatar} />
              <p className={styles.modal__name}>{winner?.publicname}</p>
            </div>
            <div className={styles.modal__winnerValue}>+ {winnerValue}</div>
          </div>
        </>
        {/* ) : (
        <div className={styles.modal__columnContent}>
          <p className={styles.modal__text}>{gameValue}</p>
          <h3 className={styles.modal__title}>Вы выиграли!</h3>
          <div className={styles.modal__winnerValue}>+ {winnerValue}</div>
        </div>
        )} */}
        {/* <div className={styles.modal__buttons}>
          <button onClick={leaveRoom} className={styles.modal__button}>Выход</button>
          <button onClick={closeModal} className={styles.modal__button} style={{ backgroundColor: '#FFFFFF' }}>Играть снова</button>
        </div> */}
      </div>
      <ModalOverlay closeModal={closeModal} />
    </>,
    document.getElementById('closest-root') as HTMLElement
  )
};
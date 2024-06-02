/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./ClosestModal.module.scss";
import ModalOverlay from "../ModalOverlay/ModalOverlay";
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import { leaveRoomRequest } from "../../../api/gameApi";
import useTelegram from "../../../hooks/useTelegram";

interface IProps {
  title?: string;
  closeModal: () => void;
  winValue?: string;
  player?: any;
  number?: string;
}

export const ClosestModal: FC<IProps> = ({ title, closeModal }) => {
  const { user } = useTelegram();
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
        console.log(res)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return ReactDOM.createPortal(
    <>
      <div className={styles.modal}>
        {<>
          <h3 className={styles.modal__title}>Победитель</h3>
          <div className={styles.modal__content}>
            <p className={styles.modal__text}>24</p>
            <div className={styles.modal__avatar}>
              <UserAvatar />
              <p className={styles.modal__name}>Имя пользователя</p>
            </div>
            <div className={styles.modal__winnerValue}>+ 500</div>
          </div>
        </>}
        <div className={styles.modal__buttons}>
          <button onClick={leaveRoom} className={styles.modal__button}>Выход</button>
          <button onClick={closeModal} className={styles.modal__button} style={{ backgroundColor: '#FFFFFF' }}>Играть снова</button>
        </div>
        {/* <button className={styles.close} onClick={closeModal}>
          <CrossIcon color="#000" width={12} height={12} />
        </button> */}
      </div>
      <ModalOverlay closeModal={closeModal} />
    </>,
    document.getElementById('closest-root') as HTMLElement
  )
};
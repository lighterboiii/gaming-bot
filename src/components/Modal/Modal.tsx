import { FC, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

import CrossIcon from "../../icons/Cross/Cross";

import styles from './Modal.module.scss'
import ModalOverlay from "./ModalOverlay/ModalOverlay";

interface IModal {
  title?: string;
  children: ReactNode;
  closeModal: () => void;
  className?: string;
}

export const Modal: FC<IModal> = ({ title, children, closeModal }) => {

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

  return ReactDOM.createPortal(
    <>
      <div className={styles.modal}>
        <h3 className={styles.modal__title}>{title}</h3>
        <button className={styles.close}
          onClick={closeModal}>
          <CrossIcon color="#000"
            width={12}
            height={12} />
        </button>
        {children}
      </div>
      <ModalOverlay closeModal={closeModal} />
    </>,
    document.getElementById('modal-root') as HTMLElement
  )
};
import { FC, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from './Modal.module.scss'
import ModalOverlay from "./ModalOverlay/ModalOverlay";
import CrossIcon from "../../icons/Cross/Cross";

interface IModal {
  title?: string;
  children: ReactNode;
  closeModal: () => void;
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
        <span className={styles.close} onClick={closeModal}>
          <CrossIcon color="#000" width={12} height={12} />
        </span>
        {children}
      </div>
      <ModalOverlay closeModal={closeModal}/>
    </> ,
    document.getElementById('modal-root') as HTMLElement
  )
};
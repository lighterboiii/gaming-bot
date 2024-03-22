import { FC } from 'react';
import styles from './ModalOverlay.module.scss';

interface IProps {
  closeModal: () => void;
}

const ModalOverlay: FC<IProps> = ({ closeModal }) => {
  return(
    <div className={styles.overlay} onClick={closeModal} ></div>
  )
};

export default ModalOverlay;
import { FC } from "react";
import styles from './Overlay.module.scss';

interface IProps {
  show: boolean;
  onClose?: () => void;
  children: JSX.Element;
}

const Overlay: FC<IProps> = ({ show, onClose, children }) => {
  return (
    <div className={`${styles.overlay} ${show ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.overlay__children}>
        {children}
      </div>
    </div>
  );
};

export default Overlay;

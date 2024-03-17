import { FC } from "react";
import styles from './Overlay.module.scss';

interface IProps {
  show: boolean;
  children: JSX.Element;
  onClose?: () => void;
}

const Overlay: FC<IProps> = ({ show, children, onClose }) => {
  return (
    <div className={`${styles.overlay} ${show ? styles.active : ''}`}>
      <div className={styles.overlay__children}>
        {children}
      </div>
    </div>
  );
};

export default Overlay;

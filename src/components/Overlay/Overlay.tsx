import { FC } from "react";
import styles from './Overlay.module.scss';
import CrossIcon from "../../icons/Cross/Cross";

interface IProps {
  show: boolean;
  children: JSX.Element;
  onClose?: () => void;
  closeButton?: boolean;
  buttonColor?: string;
  crossColor?: string;
}

const Overlay: FC<IProps> = ({ show, children, onClose, closeButton, buttonColor = '#ac1a44', crossColor = '#FFF' }) => {
  return (
    <div className={`${styles.overlay} ${show ? styles.active : ''}`}>
      <div className={styles.overlay__children}>
        {children}
      </div>
      {closeButton &&
        <button
          onClick={onClose}
          className={styles.overlay__closeButton}
          style={{ backgroundColor: buttonColor }}
        >
          <CrossIcon width={12} height={12} color={crossColor} />
        </button>
      }
    </div>
  );
};

export default Overlay;

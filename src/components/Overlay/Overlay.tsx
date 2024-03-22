import { FC } from "react";
import styles from './Overlay.module.scss';
import CrossIcon from "../../icons/Cross/Cross";

interface IProps {
  show: boolean;
  children: JSX.Element;
  onClose?: () => void;
  closeButton?: boolean;
}

const Overlay: FC<IProps> = ({ show, children, onClose, closeButton }) => {
  return (
    <div className={`${styles.overlay} ${show ? styles.active : ''}`}>
      <div className={styles.overlay__children}>
        {children}
      </div>
      {closeButton && <button
        onClick={onClose}
        className={styles.overlay__closeButton}
      >
        <CrossIcon width={16} height={16} />
      </button>
}
    </div>
  );
};

export default Overlay;

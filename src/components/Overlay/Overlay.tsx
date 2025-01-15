import { FC } from "react";

import CrossIcon from "../../icons/Cross/Cross";
import { triggerHapticFeedback } from "../../utils/hapticConfig";

import styles from './Overlay.module.scss';

interface IProps {
  show: boolean;
  children: JSX.Element;
  onClose?: () => void;
  closeButton?: boolean;
  buttonColor?: string;
  crossColor?: string;
}

const Overlay: FC<IProps> = ({
  show,
  children,
  onClose,
  closeButton,
  buttonColor = '#ac1a44',
  crossColor = '#FFF'
}) => {

  const handleClose = () => {
    triggerHapticFeedback('impact', 'soft');
    onClose && onClose();
  }

  return (
    <div className={`${styles.overlay} ${show ? styles.active : ''}`}>
      <div className={styles.overlay__children}>
        {children}
      </div>
      {closeButton &&
        <button
          onClick={handleClose}
          className={styles.overlay__closeButton}
          style={{ backgroundColor: buttonColor }}
        >
          <CrossIcon width={12}
            height={12}
            color={crossColor} />
        </button>
      }
    </div>
  );
};

export default Overlay;

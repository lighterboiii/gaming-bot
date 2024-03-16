import { FC, useEffect, useState } from "react";
import styles from './Overlay.module.scss';

interface IProps {
  show: boolean;
  children: JSX.Element;
  onClose?: () => void;
}

const Overlay: FC<IProps> = ({ show, children, onClose }) => {
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      setTouchStartY(event.touches[0].clientY);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      setTouchEndY(event.changedTouches[0].clientY);
      handleSwipe();
    };

    const handleSwipe = () => {
      if (touchStartY - touchEndY > 20 && onClose) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [show, touchStartY, touchEndY, onClose]);
  return (
    <div className={`${styles.overlay} ${show ? styles.active : ''}`}>
      <div className={styles.overlay__children}>
        {children}
      </div>
    </div>
  );
};

export default Overlay;

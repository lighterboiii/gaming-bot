import React from 'react';

import styles from './LogOverlay.module.scss';

interface LogOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  overlayRef: React.RefObject<HTMLDivElement>;
}

export const LogOverlay: React.FC<LogOverlayProps> = ({
  isVisible,
  onClose,
  overlayRef
}) => {
  return (
    <div className={styles.logOverlayWrapper}>
      <div
        ref={overlayRef}
        className={`${styles.logOverlay} ${isVisible ? styles.expanded : ''}`}
      >
        <div className={styles.logOverlay__header}>
          <h2 className={styles.logOverlay__title}>История ставок</h2>
          <button 
            className={styles.logOverlay__closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className={styles.logOverlay__content}>
          контент
        </div>
      </div>
    </div>
  );
};
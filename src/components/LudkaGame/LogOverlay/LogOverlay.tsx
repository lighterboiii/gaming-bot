/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import coinIcon from '../../../images/mount/coinIcon.png';

import styles from './LogOverlay.module.scss';

interface LogOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  overlayRef: React.RefObject<HTMLDivElement>;
  users: any;
}

export const LogOverlay: React.FC<LogOverlayProps> = ({
  isVisible,
  onClose,
  overlayRef,
  users
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
          {users === "none" ? (
            <div className={styles.logOverlay__empty}>
              <p>История ставок пока пуста</p>
            </div>
          ) : (
            <div className={styles.logOverlay__list}>
              {users.map((user: any, index: number) => (
                <div key={index} className={styles.logOverlay__item}>
                  <p className={styles.logOverlay__username}>{user.username}</p>
                  <div className={styles.logOverlay__bet}>
                    <img src={coinIcon} alt="coin" className={styles.logOverlay__icon} />
                    <span>{user.bet}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
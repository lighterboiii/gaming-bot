/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import UserAvatar from 'components/User/UserAvatar/UserAvatar';

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
  users,

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
                  <div className={styles.logOverlay__avatar}>
                    <UserAvatar item={user} />
                  </div>
                  <div className={styles.logOverlay__userNameContainer}>
                    <p className={styles.logOverlay__userName}>
                      {user.user_name}
                    </p>
                    <p className={styles.logOverlay__money}>
                      +
                      <img src={coinIcon} alt="money" className={styles.logOverlay__moneyIcon} />
                      {user.coins}
                    </p>
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
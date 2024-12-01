/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import UserAvatar from '../../../components/User/UserAvatar/UserAvatar';
import coinIcon from '../../../images/mount/coinIcon.png';
import { useAppSelector } from '../../../services/reduxHooks';
import { ILogOverlayProps } from '../../../utils/types/gameTypes';

import styles from './LogOverlay.module.scss';

export const LogOverlay: React.FC<ILogOverlayProps> = ({
  isVisible,
  onClose,
  overlayRef,
  users,
  shouldReset
}) => {
  const displayUsers = shouldReset ? "none" : users;
  const translation = useAppSelector(store => store.app.languageSettings);
  
  return (
    <div className={styles.logOverlayWrapper}>
      <div
        ref={overlayRef}
        className={`${styles.logOverlay} ${isVisible ? styles.expanded : ''}`}
      >
        <div className={styles.logOverlay__header}>
          <h2 className={styles.logOverlay__title}>{translation?.ludka_bet_history}</h2>
          <button
            className={styles.logOverlay__closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className={styles.logOverlay__content}>
          {displayUsers === "none" ? (
            <div className={styles.logOverlay__empty}>
              <p>{translation?.ludka_bet_clear_history}</p>
            </div>
          ) : (
            <div className={styles.logOverlay__list}>
              {displayUsers.map((user: any, index: number) => (
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
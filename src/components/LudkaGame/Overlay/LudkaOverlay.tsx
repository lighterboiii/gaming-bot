import React from 'react';

import { useAppSelector } from '../../../services/reduxHooks';
import { ILudkaOverlayProps } from '../../../utils/types/gameTypes';

import styles from './LudkaOverlay.module.scss';

export const Overlay: React.FC<ILudkaOverlayProps> = ({
  isVisible,
  inputValue,
  inputError,
  onKeyPress,
  onDelete,
  onDecimalPoint,
  onSubmit,
  overlayRef,
}) => {
  const translation = useAppSelector(store => store.app.languageSettings);
  
  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${isVisible ? styles.expanded : ''}`}
    >
      <div className={styles.overlay__inputContainer}>
        <p className={styles.overlay__inputLabel}>
          {translation?.ludka_enter_bet}
        </p>
        <input
          type="text"
          className={`${styles.overlay__input} ${inputError ? styles.overlay__invalidInput : ''}`}
          value={inputValue}
          placeholder="0"
          readOnly
        />
      </div>

      <div className={styles.overlay__keyboard}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, ['←', '.'], 0, 'Готово'].map((key) => (
          <React.Fragment key={Array.isArray(key) ? 'split-buttons' : key}>
            {Array.isArray(key) ? (
              <div className={styles.overlay__splitButtons}>
                {key.map((subKey) => (
                  <button
                    key={subKey}
                    className={subKey === '.' ? 
                      styles.overlay__key : 
                      styles.overlay__bottomLeftButton
                    }
                    onClick={() => {
                      if (subKey === '←') onDelete();
                      if (subKey === '.') onDecimalPoint();
                    }}
                  >
                    {subKey}
                  </button>
                ))}
              </div>
            ) : (
              <button
                className={typeof key === 'number' ?
                  styles.overlay__key :
                  styles.overlay__bottomRightButton
                }
                onClick={() => {
                  if (typeof key === 'number') onKeyPress(key);
                  else onSubmit();
                }}
              >
                {key}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}; 
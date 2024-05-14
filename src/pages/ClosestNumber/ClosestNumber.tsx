/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useRef } from "react";
import styles from './ClosestNumber.module.scss';
import { leaveRoomRequest } from "../../api/gameApi";
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { userId } from "../../api/requestData";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";

const ClosestNumber: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tg.setHeaderColor('#1b50b8');
    tg.BackButton.show().onClick(() => {
      leaveRoomRequest(userId)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        })
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tg, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setShowOverlay(false);
      }
    };

    if (showOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOverlay]);

  const handleInputFocus = () => {
    setShowOverlay(true);
  };

  const handleKeyPress = (key: number) => {
    setInputValue((prevValue) => prevValue + key.toString());
  };

  const handleDeleteNumber = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  const handleSubmit = () => {
    console.log(`Choice: ${inputValue}`);
  };


  return (
    <div className={styles.game}>
      <div ref={overlayRef} className={`${styles.overlay} ${showOverlay ? styles.expanded : ''}`}>
        <div className={styles.overlay__inputWrapper}>
          <div className={styles.overlay__avatarWrapper}>
            <UserAvatar />
          </div>
          <input
            type="number"
            placeholder="Ваше число"
            className={styles.overlay__input}
            value={inputValue}
            onFocus={handleInputFocus}
            readOnly
          />
          <button>ж</button>
        </div>
        {showOverlay && (
          <div className={styles.overlay__keyboard}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((key) => (
              <button
                key={key}
                className={styles.overlay__key}
                onClick={() => handleKeyPress(key)}>
                {key}
              </button>
            ))}
            <button
              disabled={inputValue === ''}
              className={`${styles.overlay__key}  ${styles.overlay__bottomLeftButton}`}
              onClick={() => handleDeleteNumber()}>
              Стереть
            </button>
            <button
              disabled={inputValue === ''}
              className={`${styles.overlay__key} ${styles.overlay__bottomRightButton}`}
              onClick={() => handleSubmit()}>
              Готово
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default ClosestNumber;
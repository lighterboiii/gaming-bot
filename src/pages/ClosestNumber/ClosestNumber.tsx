/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './ClosestNumber.module.scss';
import { leaveRoomRequest } from "../../api/gameApi";
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { userId } from "../../api/requestData";

const ClosestNumber: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  // const userId = user?.id;
  const [showOverlay, setShowOverlay] = useState(false);

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

  const handleInputFocus = () => {
    setShowOverlay(true);
  };

  const handleInputBlur = () => {
    setShowOverlay(false);
  };


  return (
    <div className={styles.game}>
      <div>
        <div className={styles.game__betContainer}>
          <p className={styles.game__bet}>
            Ставка
            <span className={styles.game__text}>
              🔰
            </span>
            24
          </p>
        </div>
        <div className={`${styles.overlay} ${showOverlay ? styles.expanded : ''}`}>
          <input
            type="number"
            className={styles.input}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {showOverlay && (
            <div className={styles.keyboard}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((key) => (
                <button key={key} className={styles.key}>
                  {key}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
};

export default ClosestNumber;
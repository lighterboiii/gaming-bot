import { FC, useEffect } from "react";
import ReactDOM from "react-dom";

import { useAppSelector } from "services/reduxHooks";

import { IRPSPlayer } from "../../../utils/types/gameTypes";
import ModalOverlay from "../../Modal/ModalOverlay/ModalOverlay";
import UserAvatar from "../../User/UserAvatar/UserAvatar";

import styles from "./ClosestModal.module.scss";

interface IProps {
  closeModal: () => void;
  gameValue?: number;
  winnerValue?: string;
  winner?: IRPSPlayer;
  betType: string;
  isTie?: boolean;
  tieWinners?: IRPSPlayer[];
}

export const ClosestModal: FC<IProps> = ({
  closeModal,
  winner,
  winnerValue,
  gameValue,
  betType,
  isTie,
  tieWinners
}) => {
  const translation = useAppSelector(store => store.app.languageSettings);
  useEffect(() => {
    const handleEscClose = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [closeModal]);

  return ReactDOM.createPortal(
    <>
      <div className={styles.modal}>
        {winnerValue && winnerValue !== "0.0"
          ? <h3 className={styles.modal__title}>{isTie
            ? `${translation?.winners_text}`
            : `${translation?.winner_text}`}
          </h3>
          : <h3 className={styles.modal__title}>{translation?.draw}</h3>}
        <div className={styles.modal__content}>
          {isTie ? (
            <div className={styles.modal__draw}>
              {tieWinners?.map((winner, index) => (
                <div className={styles.modal__tieContainer}>
                  <div key={index} className={styles.modal__drawatar}>
                    <UserAvatar item={winner} avatar={winner?.avatar} />
                  </div>
                  <div className={styles.modal__winnerValue}>
                    + {winnerValue} {betType === "1" ? `💵` : `🔰`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className={styles.modal__text}>{gameValue}</p>
              <div className={styles.modal__avatar}>
                <UserAvatar item={winner} avatar={winner?.avatar} />
                <p className={styles.modal__name}>{winner?.publicname}</p>
              </div>
              <div className={styles.modal__winnerValue}>
                + {winnerValue} {betType === "1" ? `💵` : `🔰`}
              </div>
            </>
          )}
        </div>
      </div>
      <ModalOverlay closeModal={closeModal} />
    </>,
    document.getElementById('closest-root') as HTMLElement
  );
};


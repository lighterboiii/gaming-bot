import { FC } from "react";
import styles from './EmojiOverlay.module.scss';
import CrossIcon from "../../icons/Cross/Cross";

interface IProps {
  show: boolean;
  onClose: () => void;
}

const EmojiOverlay: FC<IProps> = ({ show, onClose }) => {
  return (
    <div className={`${styles.overlay} ${show ? styles.active : ''}`}>
      <div className={styles.overlay__children}>
        <h2>Имя стикерпака</h2>
        <p>Сам стикерпак тут замапим</p>
      </div>
        <button
          onClick={onClose}
          className={styles.overlay__closeButton}
        >
          <CrossIcon width={12} height={12} color="#0D2759" />
        </button>
    </div>
  )
};

export default EmojiOverlay;
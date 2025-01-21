/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';

import { useEmojiPack } from '../../hooks/useEmojiPack';
import CrossIcon from '../../icons/Cross/Cross';

import styles from './EmojiOverlay.module.scss';

interface EmojiOverlayProps {
  show: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  backgroundColor?: string;
  userId: number;
}

const EmojiOverlay: FC<EmojiOverlayProps> = ({
  show,
  onClose,
  onEmojiSelect,
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  userId
}) => {
  const { emojiPack, isLoading } = useEmojiPack(userId);

  if (isLoading || !emojiPack) {
    return null;
  }

  return (
    <div
      className={`${styles.overlay} ${show ? styles.active : ''}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={styles.overlay__children}>
        <h2 className={styles.overlay__name}>{emojiPack.name}</h2>
        <div className={styles.overlay__emojis}>
          {emojiPack.emojis.map((emoji: string, index: number) => (
            <img
              key={index}
              src={emoji}
              alt={`Emoji ${index}`}
              className={styles.overlay__emoji}
              onClick={() => onEmojiSelect(String(index + 1))}
            />
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        className={styles.overlay__closeButton}
      >
        <CrossIcon width={12}
          height={12}
          color="#0D2759" />
      </button>
    </div>
  )
};

export default EmojiOverlay;

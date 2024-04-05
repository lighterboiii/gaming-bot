/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './EmojiOverlay.module.scss';
import CrossIcon from "../../icons/Cross/Cross";
import { getActiveEmojiPack } from "../../api/mainApi";
import { userId } from "../../api/requestData";
import useTelegram from "../../hooks/useTelegram";

interface IProps {
  show: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

const EmojiOverlay: FC<IProps> = ({ show, onClose, onEmojiSelect }) => {
  const { user } = useTelegram();
  // const userId = user?.id;
  const [emojis, setEmojis] = useState<any>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    getActiveEmojiPack(userId)
      .then((res: any) => {
        setName(res.user_emoji_pack.name);
        setEmojis(res.user_emoji_pack.user_emoji_pack);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={`${styles.overlay} ${show ? styles.active : ''}`}>
      <div className={styles.overlay__children}>
        <h2 className={styles.overlay__name}>{name}</h2>
        <div className={styles.overlay__emojis}>
          {emojis && emojis?.map((emoji: string, index: number) => (
            <img
              key={index}
              src={emoji}
              alt={`Emoji ${index}`}
              className={styles.overlay__emoji}
              onClick={() => onEmojiSelect(emoji)}
            />
          ))}
        </div>
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

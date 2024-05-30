import { FC, memo } from 'react';
import styles from './HandShake.module.scss';

interface IProps {
  player1: string;
  player2: string;
}

const HandShake: FC<IProps> = ({ player1, player2 }) => {
  return (
    <div className={styles.hands}>
      <img
        src={player1}
        alt="left hand"
        className={`${styles.hands__mainImage} ${styles.hands__leftMainImage}`}
      />
      <img
        src={player2}
        alt="right hand"
        className={`${styles.hands__mainImage} ${styles.hands__rightMainImage}`}
      />
    </div>
  );
};

export default memo(HandShake);

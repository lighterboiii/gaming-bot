import { FC, useEffect, useState, useRef } from 'react';
import styles from './HandShake.module.scss';

interface IProps {
  prevChoices: { player1: string; player2: string };
  userId?: any;
}

const HandShake: FC<IProps> = ({ prevChoices }) => {
  const { player1, player2 } = prevChoices;
  const [handImages, setHandImages] = useState({
    leftHandImage: '',
    rightHandImage: '',
  });

  const handImagesRef = useRef({
    leftHandImage: '',
    rightHandImage: '',
  });

  useEffect(() => {
    handImagesRef.current.leftHandImage = player1;
    handImagesRef.current.rightHandImage = player2;

    const timeoutId = setTimeout(() => {
      setHandImages({
        leftHandImage: handImagesRef.current.leftHandImage,
        rightHandImage: handImagesRef.current.rightHandImage,
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [player1, player2]);

  return (
    <div className={styles.hands}>
      <img
        src={handImages.leftHandImage}
        alt="left hand"
        className={`${styles.hands__mainImage} ${styles.hands__leftMainImage}`}
      />
      <img
        src={handImages.rightHandImage}
        alt="right hand"
        className={`${styles.hands__mainImage} ${styles.hands__rightMainImage}`}
      />
    </div>
  );
};

export default HandShake;

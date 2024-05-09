/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
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
  useEffect(() => {
    setHandImages({
      leftHandImage: player1,
      rightHandImage: player2,
    })
  }, [player1, player2]);

  return (
    <div className={styles.hands}>
      <img src={handImages.leftHandImage} alt="left hand" className={`${styles.hands__mainImage} ${styles.hands__leftMainImage}`} />
      <img src={handImages.rightHandImage} alt="right hand" className={`${styles.hands__mainImage} ${styles.hands__rightMainImage}`} />
    </div>
  );
};

export default HandShake;

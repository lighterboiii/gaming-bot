/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import styles from './HandShake.module.scss';

interface IProps {
  prevChoices: { player1: string; player2: string };
}

const HandShake: FC<IProps> = ({ prevChoices }) => {
  const { player1, player2 } = prevChoices;
  const [leftHandImage, setLeftHandImage] = useState<string>('');
  const [rightHandImage, setRightHandImage] = useState<string>('');

  useEffect(() => {
      setLeftHandImage(player1);
      setRightHandImage(player2);
  }, [player1, player2]);

  return (
    <div className={styles.hands}>
      <img src={leftHandImage} alt="left hand" className={`${styles.hands__mainImage} ${styles.hands__leftMainImage}`} />
      <img src={rightHandImage} alt="right hand" className={`${styles.hands__mainImage} ${styles.hands__rightMainImage}`} />
    </div>
  );
};

export default HandShake;

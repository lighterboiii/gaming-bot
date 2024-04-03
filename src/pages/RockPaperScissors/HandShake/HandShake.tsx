/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import styles from './HandShake.module.scss';
import leftPP from '../../../images/rock-paper-scissors/l-pp.png'
import leftPR from '../../../images/rock-paper-scissors/l-pr.png';
import leftPS from '../../../images/rock-paper-scissors/l-ps.png';
import rightPP from '../../../images/rock-paper-scissors/r-pp.png';
// import rightPS from '../../images/rock-paper-scissors/r-ps.png';
import rightPR from '../../../images/rock-paper-scissors/r-pr.png';
import leftRR from '../../../images/rock-paper-scissors/l-rr.png';
import leftRP from '../../../images/rock-paper-scissors/l-rp.png';
import leftRS from '../../../images/rock-paper-scissors/l-rs.png';
import rightRR from '../../../images/rock-paper-scissors/r-rr.png';
import rightRP from '../../../images/rock-paper-scissors/r-rp.png';
import rightRS from '../../../images/rock-paper-scissors/r-rs.png';
import leftSS from '../../../images/rock-paper-scissors/l-ss.png';
import leftSR from '../../../images/rock-paper-scissors/l-sr.png';
import leftSP from '../../../images/rock-paper-scissors/l-sp.png';
import rightSS from '../../../images/rock-paper-scissors/r-ss.png';
import rightSR from '../../../images/rock-paper-scissors/r-sr.png';
import rightSP from '../../../images/rock-paper-scissors/r-sp.png';


interface IProps {
  playerChoice: any;
  secondPlayerChoice: any;
}

const HandShake: FC<IProps> = ({ playerChoice, secondPlayerChoice }) => {
  const [key, setKey] = useState(false);
  const [previousChoice1, setPreviousChoice1] = useState<string | null>(null);
  const [previousChoice2, setPreviousChoice2] = useState<string | null>(null);
  // console.log(playerChoice);
  // console.log(secondPlayerChoice);
  
  useEffect(() => {
    setKey(prevKey => !prevKey);
  }, [playerChoice, secondPlayerChoice]);

  useEffect(() => {
    if (previousChoice2 !== 'ready' && (secondPlayerChoice === 'rock' || secondPlayerChoice === 'paper' || secondPlayerChoice === 'scissors')) {
      console.log('Запуск анимации для нового выбора:', playerChoice);
    }
    setPreviousChoice2(playerChoice);
  }, [playerChoice, secondPlayerChoice]);

  const getLeftHandImage = (choice: string) => {
    switch (choice) {
      case 'rock':
        return leftSR;
      case 'paper':
        return leftSP;
      case 'scissors':
        return leftSS;
      default:
        return '';
    }
  };

  const getRightHandImage = (choice: string) => {
    switch (choice) {
      case 'paper':
        return rightPP;
      case 'rock':
        return rightPR;
      case 'scissors':
        return rightRS;
      default:
        return previousChoice2!;
    }
  };

  useEffect(() => {
    getLeftHandImage(playerChoice);
    getRightHandImage(secondPlayerChoice);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [lastChoice, setChoice] = useState();
  return (
    <div className={styles.hands}>
      {(playerChoice !== 'none' && secondPlayerChoice !== 'none') && (
        <>
          <img src={getLeftHandImage(playerChoice)} alt="left hand" className={`${styles.hands__mainImage} ${styles.hands__leftMainImage}`} />
          <img src={getRightHandImage(secondPlayerChoice)} alt="right hand" className={`${styles.hands__mainImage} ${styles.hands__rightMainImage}`} />
        </>
      )
      }
    </div>
  )
};

export default HandShake;
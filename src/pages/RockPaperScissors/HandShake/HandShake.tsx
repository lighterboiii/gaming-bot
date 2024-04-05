/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import styles from './HandShake.module.scss';
import leftPP from '../../../images/rock-paper-scissors/l-pp.png'
import leftPR from '../../../images/rock-paper-scissors/l-pr.png';
import leftPS from '../../../images/rock-paper-scissors/l-ps.png';
import rightPP from '../../../images/rock-paper-scissors/r-pp.png';
import rightPS from '../../../images/rock-paper-scissors/r_ps.png';
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
  prevChoice1: string;
  prevChoice2: string;
}

const HandShake: FC<IProps> = ({ playerChoice, secondPlayerChoice, prevChoice1, prevChoice2 }) => {
  const [key, setKey] = useState(false);
  console.log(prevChoice1);
  console.log(prevChoice2);
  
  useEffect(() => {
    setKey(prevKey => !prevKey);
  }, [playerChoice, secondPlayerChoice]);

  const getLeftHandImage = (choice: string) => {
    switch (prevChoice1) {
      case 'rock':
        if (choice === 'rock') {
          return leftRR;
        } else if (choice === 'scissors') {
          return leftRS;
        } else {
          return leftRP;
        }
      case 'paper':
        if (choice === 'rock') {
          return leftPR;
        } else if (choice === 'scissors') {
          return leftPS;
        } else {
          return leftPP;
        }
      case 'scissors':
        if (choice === 'rock') {
          return leftSR
        } else if (choice === 'scissors') {
          return leftSS;
        } else {
          return leftSP;
        }
      default:
        return '';
    }
  };

  const getRightHandImage = (choice: string) => {
    switch (prevChoice2) {
      case 'rock':
        if (choice === 'rock') {
          return rightRR;
        } else if (choice === 'scissors') {
          return rightRS;
        } else {
          return rightRP;
        }
      case 'paper':
        if (choice === 'rock') {
          return rightPR;
        } else if (choice === 'scissors') {
          return rightPS;
        } else {
          return rightPP;
        }
      case 'scissors':
        if (choice === 'rock') {
          return rightSR
        } else if (choice === 'scissors') {
          return rightSS;
        } else {
          return rightSP;
        }
      default:
        return '';
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
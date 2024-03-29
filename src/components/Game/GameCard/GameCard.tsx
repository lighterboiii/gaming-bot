/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './GameCard.module.scss';
import CircleButton from '../../ui/CircleButton/CircleButton';
import game1 from '../../../images/main_hand_1_tiny.png';
import game2 from '../../../images/gameSec.png';
import ManIcon from '../../../icons/Man/Man';

interface IProps {
  game: any;
  imagePosition: "left" | "right";
  users: number;
  extraClass?: string;
  handleClickGame: (game: any) => void;
} // типизировать

const GameCard: FC<IProps> = ({ game, imagePosition, handleClickGame, extraClass }) => {

  const gameCardClassNames = classNames(
    styles.game,
    extraClass
  );

  const handleClick = () => {
    handleClickGame(game);
  };

  return (
    <div
      className={gameCardClassNames}
      onClick={handleClick}
    >
      <h3
        style={{ textAlign: imagePosition === "left" ? 'right' : 'left' }}
        className={styles.game__name}
      >
        {game.name}
      </h3>
      <img
        src={imagePosition === "left" ? game1 : game2}
        alt="hand"
        className={imagePosition === 'left' ? styles.game__image : styles.game__imageRight}
      />
      <div className={styles.game__info}>
        <p className={styles.game__players}><ManIcon /> {game.users}</p>
        <CircleButton chevronPosition="right" iconType="chevron" isWhiteBackground />
      </div>
    </div>
  )
};

export default GameCard;
import { FC } from 'react';
import classNames from 'classnames'; 
import styles from './GameCard.module.scss';
import CircleButton from '../../ui/CircleButton/CircleButton';
import game1 from '../../../images/main_hand_1_tiny.png';
import game2 from '../../../images/gameSec.png';
import { Link } from 'react-router-dom';

interface IProps {
  game: any;
  imagePosition: "left" | "right";
  users: number;
  extraClass?: string;
}

const GameCard: FC<IProps> = ({ game, imagePosition, users, extraClass }) => {
  const gameCardClassNames = classNames(
    styles.game,
    extraClass
  );

  return (
    <Link to="/any" className={gameCardClassNames}>
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
        <p className={styles.game__players}>{game.users}</p>
        <CircleButton chevronPosition="right" iconType="chevron" isWhiteBackground />
      </div>
    </Link>
  )
};

export default GameCard;
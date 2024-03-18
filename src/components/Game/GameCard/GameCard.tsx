import { FC } from 'react';
import styles from './GameCard.module.scss';
import CircleButton from '../../ui/CircleButton/CircleButton';

interface IProps {
  game: any;
  imagePosition: "left" | "right";
  users: number;
}

const GameCard: FC<IProps> = ({ game, imagePosition, users }) => {
  return (
    <div className={styles.game}>
      <h3 className={styles.game__name}>{game.name}</h3>
      <img src="" alt="hand" className={imagePosition === 'left' ? styles.game__image : styles.game__imageRight} />
      <div className={styles.game__info}>
        <p className={styles.game__players}>{game.users}</p>
        <CircleButton chevronPosition="right" iconType="chevron" isWhiteBackground />
      </div>
    </div>
  )
};

export default GameCard;
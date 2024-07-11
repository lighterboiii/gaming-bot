import classNames from 'classnames';
import { FC } from 'react';

import CircleButton from 'Components/ui/CircleButton/CircleButton';
import ManIcon from 'Icons/Man/Man';
import game2 from 'Images/gameSec.png';
import game1 from 'Images/main_hand_1_tiny.png';
import { useAppSelector } from 'services/reduxHooks';
import { IGameCardData } from 'Utils/types/gameTypes';

import styles from './GameCard.module.scss';

interface IProps {
  game: IGameCardData;
  imagePosition: "left" | "right";
  users: number;
  extraClass?: string;
  handleClickGame: (game: IGameCardData) => void;
}

const GameCard: FC<IProps> = ({ game, imagePosition, handleClickGame, extraClass }) => {
  const translation = useAppSelector(store => store.app.languageSettings);
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
        {game.room_type === 1 ? `${translation?.rock_paper_scissors}` : `${translation?.closest_number}`}
      </h3>
      <img
        src={imagePosition === "left" ? game1 : game2}
        alt="hand"
        className={imagePosition === 'left' ? styles.game__image : styles.game__imageRight}
      />
      <div className={styles.game__info}>
        <p className={styles.game__players}><ManIcon /> {game.users}</p>
        <CircleButton chevronPosition="right"
          iconType="chevron"
          isWhiteBackground />
      </div>
    </div>
  )
};

export default GameCard;

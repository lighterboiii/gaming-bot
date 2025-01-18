import classNames from 'classnames';
import { FC } from 'react';

import ManIcon from '../../../icons/Man/Man';
import { useAppSelector } from '../../../services/reduxHooks';
import { IGameCardData } from '../../../utils/types/gameTypes';
import CircleButton from '../../ui/CircleButton/CircleButton';

import styles from './GameCard.module.scss';

interface IProps {
  game: IGameCardData;
  image: string;
  users: number;
  extraClass?: string;
  handleClickGame: (game: IGameCardData) => void;
}

const GameCard: FC<IProps> = ({ game, handleClickGame, extraClass }) => {
  const translation = useAppSelector(store => store.app.languageSettings);
  const gameCardClassNames = classNames(
    styles.game,
    extraClass
  );

  const handleClick = () => {
    handleClickGame(game);
  };

  const getGameName = (roomType: number) => {
    switch(roomType) {
      case 1:
        return translation?.rock_paper_scissors;
      case 2:
        return translation?.closest_number;
      case 3:
        return translation?.ludka_name;
      case 4:
        return translation?.monetka_name;
      default:
        return '';
    }
  }

  const gameName = getGameName(game.room_type);

  return (
    <article 
      className={gameCardClassNames}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${gameName} game - ${game.users} players`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <header className={styles.game__header}>
        <h3 className={styles.game__name}>
          {gameName}
        </h3>
        <p className={styles.game__players} aria-label={`${game.users} active players`}>
          <ManIcon aria-hidden="true" /> 
          <span>{game.users}</span>
        </p>
      </header>
      
      <footer className={styles.game__footer}>
        <img
          src={game.url}
          alt={`${gameName} game illustration`}
          className={styles.game__image}
        />
        <div className={styles.game__buttonWrapper}>
          <CircleButton 
            chevronPosition="right"
            iconType="chevron"
            isWhiteBackground
            aria-label={`Play ${gameName}`}
          />
        </div>
      </footer>
    </article>
  );
};

export default GameCard;

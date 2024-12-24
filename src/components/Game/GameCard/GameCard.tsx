import classNames from 'classnames';
import { FC } from 'react';

import ManIcon from '../../../icons/Man/Man';
import { useAppSelector } from '../../../services/reduxHooks';
import { IGameCardData } from '../../../utils/types/gameTypes';
import CircleButton from '../../ui/CircleButton/CircleButton';

import styles from './GameCard.module.scss';

interface IProps {
  game: IGameCardData;
  imagePosition: "left" | "right";
  image: string;
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

  return (
    <div
      className={gameCardClassNames}
      onClick={handleClick}
    >
      <div className={styles.game__header}>
        <h3 className={styles.game__name}>
          {getGameName(game.room_type)}
        </h3>
        <p className={styles.game__players}>
          <ManIcon /> {game.users}
        </p>
      </div>
      
      <div className={styles.game__footer}>
        <img
          src={game.url}
          alt="game_image"
          className={styles.game__image}
        />
        <div className={styles.game__buttonWrapper}>
          <CircleButton 
            chevronPosition="right"
            iconType="chevron"
            isWhiteBackground 
          />
        </div>
      </div>
    </div>
  )
};

export default GameCard;

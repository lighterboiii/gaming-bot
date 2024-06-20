/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './CreateRoom.module.scss';
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import GameCard from "../../components/Game/GameCard/GameCard";
import Overlay from "../../components/Overlay/Overlay";
import GameSettings from "../../components/Game/GameSettings/GameSettings";
import { useAppSelector } from "../../services/reduxHooks";
import { getExistingGamesRequest } from "../../api/gameApi";
import Loader from "../../components/Loader/Loader";
import { IGameCardData } from "../../utils/types/gameTypes";
import { indexUrl } from "../../utils/routes";

const CreateRoom: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const [games, setGames] = useState<IGameCardData[] | null>(null);
  const [gameData, setGameData] = useState(null);
  const [settingsOverlay, setSettingsOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const translation = useAppSelector(store => store.app.languageSettings);

  useEffect(() => {
    setLoading(true);
    tg.BackButton.show().onClick(() => {
      navigate(indexUrl);
    });
    getExistingGamesRequest()
      .then((res: any) => {
        setGames(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      tg.BackButton.hide();
    }
  }, []);

  const handleGameClick = (game: any) => {
    setGameData(game);
    setSettingsOverlay(!settingsOverlay)
  };

  return (
    <div className={styles.create}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.create__header}>
            <h2 className={styles.create__heading}>{translation?.create_room}</h2>
          </div>
          <div className={`${styles.create__content} ${settingsOverlay ? styles.hidden : ''}`}>
            {games?.map((game: any, index: number) => (
              <GameCard
                game={game}
                key={game.id}
                imagePosition={game.id === 1 ? 'left' : 'right'}
                users={game.users}
                extraClass={
                  `${styles['create__game-card']} 
                ${index % 2 === 0 ? styles['create__game-card--even'] : styles['create__game-card--odd']}`
                }
                handleClickGame={handleGameClick} />
            ))}
          </div>
        </>
      )}
      <Overlay
        crossColor="#ac1a44"
        buttonColor="#FFF"
        closeButton
        show={settingsOverlay}
        onClose={() => setSettingsOverlay(false)}
        children={
          <GameSettings
            data={gameData}
            closeOverlay={() => setSettingsOverlay(false)}
          />}
      />
    </div>
  );
};


export default CreateRoom;
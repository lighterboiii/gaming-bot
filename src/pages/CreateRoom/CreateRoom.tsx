/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-lone-blocks */
import { postEvent } from "@tma.js/sdk";
import { FC, useEffect, useState } from "react";

import useSetTelegramInterface from "hooks/useSetTelegramInterface";

import { getExistingGamesRequest } from "../../api/gameApi";
import GameCard from "../../components/Game/GameCard/GameCard";
import GameSettings from "../../components/Game/GameSettings/GameSettings";
import Loader from "../../components/Loader/Loader";
import { Warning } from "../../components/OrientationWarning/Warning";
import Overlay from "../../components/Overlay/Overlay";
import useOrientation from "../../hooks/useOrientation";
import { useAppSelector } from "../../services/reduxHooks";
import { indexUrl } from "../../utils/routes";
import { IGameCardData } from "../../utils/types/gameTypes";

import styles from './CreateRoom.module.scss';

export const CreateRoom: FC = () => {
  const [games, setGames] = useState<IGameCardData[] | null>(null);
  const [gameData, setGameData] = useState(null);
  const [settingsOverlay, setSettingsOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const translation = useAppSelector(store => store.app.languageSettings);
  const isPortrait = useOrientation();

  useSetTelegramInterface(indexUrl);

  useEffect(() => {
    setLoading(true);
    getExistingGamesRequest()
      .then((res: any) => {
        setGames(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleGameClick = (game: any) => {
    setGameData(game);
    setSettingsOverlay(!settingsOverlay);
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
  };

  if (!isPortrait) {
    return (
      <Warning />
    );
  }

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
                image={game.id === 1 ? games[0].url : games[1].url}
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


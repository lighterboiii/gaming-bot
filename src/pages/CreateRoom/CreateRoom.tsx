/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-lone-blocks */
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getExistingGamesRequest } from "../../api/gameApi";
import GameCard from "../../components/Game/GameCard/GameCard";
import GameSettings from "../../components/Game/GameSettings/GameSettings";
import Loader from "../../components/Loader/Loader";
import { Warning } from "../../components/OrientationWarning/Warning";
import Overlay from "../../components/Overlay/Overlay";
import useOrientation from "../../hooks/useOrientation";
import useTelegram from "../../hooks/useTelegram";
import { useAppSelector } from "../../services/reduxHooks";
import { triggerHapticFeedback } from "../../utils/hapticConfig";
import { indexUrl } from "../../utils/routes";
import { IGameCardData } from "../../utils/types/gameTypes";

import styles from './CreateRoom.module.scss';

export const CreateRoom: FC = () => {
  const { tg } = useTelegram();
  const [games, setGames] = useState<IGameCardData[] | null>(null);
  const [gameData, setGameData] = useState(null);
  const [settingsOverlay, setSettingsOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const translation = useAppSelector(store => store.app.languageSettings);
  const isPortrait = useOrientation();

  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(indexUrl);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, [tg, navigate]);

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
  
  useEffect(() => {
    const originalHeight = window.innerHeight;
    document.body.style.height = `${originalHeight}px`;
  }, []);

  const handleGameClick = (game: any) => {
    setGameData(game);
    setSettingsOverlay(!settingsOverlay);
    triggerHapticFeedback('impact', 'light');
  };

  if (!isPortrait) {
    return (
      <Warning />
    );
  }

  return (
    <div className={styles.create}>
          <div className={styles.create__header}>
            <h2 className={styles.create__heading}>{translation?.create_room}</h2>
          </div>
      
      {loading ? (
        <Loader />
      ) : (
        <div className={`${styles.create__content} ${settingsOverlay ? styles.hidden : ''}`}>
          {games?.map((game: any, index: number) => (
            <GameCard
              game={game}
              key={game.id}
              image={game.id === 1 ? games[0].url : games[1].url}
              users={game.users}
              extraClass={
                `${styles['create__game-card']}`
              }
              handleClickGame={handleGameClick}
            />
          ))}
        </div>
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
          />
        }
      />
    </div>
  );
};


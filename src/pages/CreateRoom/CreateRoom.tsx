/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-lone-blocks */
import { postEvent } from "@tma.js/sdk";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getExistingGamesRequest } from "API/gameApi";
import GameCard from "Components/Game/GameCard/GameCard";
import GameSettings from "Components/Game/GameSettings/GameSettings";
import Loader from "Components/Loader/Loader";
import Overlay from "Components/Overlay/Overlay";
import useTelegram from "Hooks/useTelegram";
import { useAppSelector } from "services/reduxHooks";
import { indexUrl } from "Utils/routes";
import { IGameCardData } from "Utils/types/gameTypes";

import styles from './CreateRoom.module.scss';

export const CreateRoom: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const [games, setGames] = useState<IGameCardData[] | null>(null);
  const [gameData, setGameData] = useState(null);
  const [settingsOverlay, setSettingsOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const translation = useAppSelector(store => store.app.languageSettings);

  useEffect(() => {
    setLoading(true);
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
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
  }, [navigate, tg.BackButton]);

  const handleGameClick = (game: any) => {
    setGameData(game);
    setSettingsOverlay(!settingsOverlay);
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
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


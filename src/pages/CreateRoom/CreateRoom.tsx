/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './CreateRoom.module.scss';
import { useNavigate } from "react-router-dom";
import { userId } from "../../api/requestData";
import useTelegram from "../../hooks/useTelegram";
import { games } from "../../utils/mockData";
import GameCard from "../../components/Game/GameCard/GameCard";
import Overlay from "../../components/Overlay/Overlay";
import GameSettings from "../../components/Game/GameSettings/GameSettings";

const CreateRoom: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  // const [betAmount, setBetAmount] = useState(0.1);
  // const [currency, setCurrency] = useState('💵');
  const [gameData, setGameData] = useState(null);
  const [settingsOverlay, setSettingsOverlay] = useState(false);
  // const dispatch = useAppDispatch();
  // const userCoins = useAppSelector(store => store.app.info);

  useEffect(() => {
    tg.BackButton.show().onClick(() => {
      navigate(-1);
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
      <div className={styles.create__header}>
        <h2 className={styles.create__heading}>Создать комнату</h2>
      </div>
      <div className={`${styles.create__content} ${settingsOverlay ? styles.hidden : ''}`}>
        {games.map((game: any, index: number) => (
          <GameCard
            game={game}
            key={game.id}
            imagePosition={game.id === 1 ? 'left' : 'right'}
            users={game.users}
            extraClass={`${styles['create__game-card']} ${
              index % 2 === 0 ? styles['create__game-card--even'] : styles['create__game-card--odd']
            }`}
            handleClickGame={handleGameClick}
          />
        ))}
      </div>
        <Overlay 
        crossColor="#ac1a44"
        buttonColor="#FFF"
        closeButton
        show={settingsOverlay} 
        onClose={() => setSettingsOverlay(false)} 
        children={
        <GameSettings
          data={gameData}
          />}
        />
    </div>
  );
};


export default CreateRoom;
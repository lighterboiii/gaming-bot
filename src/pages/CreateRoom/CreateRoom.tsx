/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './CreateRoom.module.scss';
import { useNavigate } from "react-router-dom";
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import SmallButton from "../../components/ui/SmallButton/SmallButton";
import { roomsUrl } from "../../utils/routes";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { putReq } from "../../api/api";
import { newTokensValue, setTokensValueUri, userId } from "../../api/requestData";
import useTelegram from "../../hooks/useTelegram";
import { games } from "../../utils/mockData";
import GameCard from "../../components/Game/GameCard/GameCard";

const CreateRoom: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(0.1);
  const [currency, setCurrency] = useState('💵');

  const dispatch = useAppDispatch();
  const userCoins = useAppSelector(store => store.user.userData?.info.coins);

  useEffect(() => {
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, []);

  const handleCreateRoom = () => {
    // Логика для создания комнаты
  };

  const handleFindRoom = () => {
    // Логика для поиска открытой комнаты
  };

  return (
    <div className={styles.create}>
      <div className={styles.create__header}>
        <h2 className={styles.create__heading}>Создать комнату</h2>
      </div>
      <div className={styles.create__content}>
        {games.map((game: any, index: number) => (
          <GameCard
            game={game}
            key={game.id}
            imagePosition={game.id === 1 ? 'left' : 'right'}
            users={game.users}
            extraClass={`${styles['create__game-card']} ${
              index % 2 === 0 ? styles['create__game-card--even'] : styles['create__game-card--odd']
            }`}
    
          />
        ))}
      </div>
    </div>
  );
};


export default CreateRoom;

{/* 
      <div className={styles.create__content}>
        <div className={styles.create__bets}>
          <label className={styles.create__label}>
            <p className={styles.create__text}>Введите сумму ставки</p>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="10000"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value))}
              className={styles.create__input}
            />
          </label>
          <label className={styles.create__label}>
            <p className={styles.create__text}>Выберите валюту</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={styles.create__input}
            >
              <option value="💵">💵</option>
              <option value="🔰">🔰</option>
            </select>
          </label>
          <button onClick={handleSetTokens}>Set Tokens Value</button>
          <p style={{ color: '#FFF' }}>{userCoins}</p>
        </div>
        <div className={styles.create__buttons}>
          <SmallButton to={'/game'} text="Создать комнату" secondaryText="И начать играть" isWhiteBackground />
          <SmallButton to={'/games'} text="Найти открытую комнату" secondaryText="Для игры с другими" />
        </div>
      </div> */}
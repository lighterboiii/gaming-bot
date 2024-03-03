/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './CreateRoom.module.scss';
import { useNavigate } from "react-router-dom";
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import SmallButton from "../../components/ui/SmallButton/SmallButton";
import { balanceUrl } from "../../utils/routes";

const CreateRoom: FC = () => {
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(0.1);
  const [currency, setCurrency] = useState('💵');

  const handleCreateRoom = () => {
    // Логика для создания комнаты
  };

  const handleFindRoom = () => {
    // Логика для поиска открытой комнаты
  };

  return (
    <div className={styles.create}>
      <div className={styles.create__header}>
        <button onClick={() => navigate(-1)} className={styles.create__chevron}>
          <CircleButton chevronPosition="left" />
        </button>
        <h2 className={styles.create__heading}>Создать комнату</h2>
      </div>
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
        </div>
        <div className={styles.create__buttons}>
          <SmallButton to={balanceUrl} text="Создать комнату" secondaryText="И начать играть" isWhiteBackground />
          <SmallButton to={balanceUrl} text="Найти открытую комнату" secondaryText="Для игры с другими" />
        </div>
      </div>
    </div>
  );
};


export default CreateRoom;
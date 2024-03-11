import { FC, useState } from "react";
import useTelegram from "../../hooks/useTelegram";
import styles from './Game.module.scss';
import { useNavigate } from "react-router-dom";

const Game: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useTelegram();
  const [choice, setChoice] = useState('');
  const navigate = useNavigate();

  const handleChoice = (value: string) => {
    setChoice(value);
  }

  return (
    <div className={styles.game}>
      <h3 className={styles.game__heading}>На кону 150 💵</h3>
      {choice && <h4 className={styles.game__heading}>Вы выбрали {choice}</h4>}
      <button className={styles.game__button} onClick={() => handleChoice('Камень')}>Камень</button>
      <button className={styles.game__button} onClick={() => handleChoice('Ножницы')}>Ножницы</button>
      <button className={styles.game__button} onClick={() => handleChoice('Бумага')}>Бумага</button>
      <button onClick={() => navigate(-1)}>go back</button>
    </div>
  )
}

export default Game;
import { FC } from "react";
import styles from './Balance.module.scss';
import { useNavigate } from "react-router-dom";

const Balance: FC = () => {
  const navigate = useNavigate();
  return (
  <div className={styles.balance}>
    <button type="button" onClick={() => navigate(-1)}>Давай обратно, тут ничего нет пока</button>
  </div>
  )
}

export default Balance;
import { FC } from "react";
import styles from './Balance.module.scss';
import { useNavigate } from "react-router-dom";

const Balance: FC = () => {

  return (
  <div className={styles.balance}>
    <div className={styles.balance__content}>
      <div className={styles.balance__amount}>
        <h3 className={styles.balance__h3}>0</h3>
        <h3 className={styles.balance__h3}>Баллов</h3>
      </div>
      <p className={styles.balance__text}>
      Дальше ты будешь получать +50 баллов за каждый завершенный заказ. Подробности в профиле.
      </p>
      <p className={styles.balance__text}>
      При оформлении заказа ты можешь потратить накопленные баллы. 1 балл = 1 ₽.
      </p>
    </div>
    <div className={styles.balance__history}>
      <h4 className={styles.balance__h4}>История</h4>
      <p className={styles.balance__text}>Пока что у тебя нет истории.</p>
    </div>
  </div>
  )
}

export default Balance;
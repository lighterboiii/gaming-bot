import { FC } from "react";
import styles from './Shop.module.scss';
import UserInfo from "../../components/SecondaryUserInfo/SecondaryUserInfo";

const Shop: FC = () => {
  return (
    <div className={styles.shop}>
      <div className={styles.shop__header}>
        <h2 className={styles.shop__title}>Магазин</h2>
        <UserInfo />
      </div>
      <div className={styles.shop__buttons}>
        <div className={styles.shop__leftButtonsContainer}>
          <button>Магазин</button>
          <button>Лавка</button>
        </div>
        <button>Приобретено</button>
      </div>
      <div>
        Skins and goods
      </div>
    </div>
  )
}

export default Shop;
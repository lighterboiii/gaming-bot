import { FC } from "react";
import styles from './Shop.module.scss';
import UserInfo from "../../components/SecondaryUserInfo/SecondaryUserInfo";
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import { useNavigate } from "react-router-dom";

const Shop: FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.shop}>
      <div style={{ position: 'absolute', top: '24px', left: '24px' }} onClick={() => navigate(-1)}>
        <CircleButton chevronPosition="left" color="#d51845" isWhiteBackground chevron />
      </div>
      <div className={styles.shop__header}>
        <h2 className={styles.shop__title}>Магазин</h2>
        <UserInfo />
      </div>
      <div className={styles.shop__buttons}>
        <div className={styles.shop__leftButtonsContainer}>
          <button className={styles.shop__button}>Магазин</button>
          <button className={styles.shop__button}>Лавка</button>
        </div>
        <button className={styles.shop__buttonWhite}>Приобретено</button>
      </div>
      <div>
        Skins and goods
      </div>
    </div>
  )
}

export default Shop;
import { FC } from "react";
import styles from './ShopLink.module.scss';
import { Link } from "react-router-dom";
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";

const ShopLink: FC = () => {
  return (
    <Link to='/balance' className={styles.shopLink}>
      <div className={styles.shopLink__left}>
        <p className={styles.shopLink__text}>Магазин</p>
        <div className={styles.shopLink__update}>Обновление магазина через: 1 час</div>
      </div>
      <div className={styles.shopLink__right}>
        <div className={styles.shopLink__avatarContainer}>
          <img src="https://i.pravatar.cc" alt="user_avatar" className={styles.shopLink__avatar} />
        </div>
      </div>
      <div className={styles.shopLink__chevron}>
        <ChevronIcon 
        color="#f01151" 
        width={24}
        height={24} 
        />
      </div>
    </Link>
  )
}

export default ShopLink;
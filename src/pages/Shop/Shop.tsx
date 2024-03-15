/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './Shop.module.scss';
import UserInfo from "../../components/SecondaryUserInfo/SecondaryUserInfo";
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import { useNavigate } from "react-router-dom";
import { shopItems, userSkinsForSale } from "../../utils/mockData";
import ShopItem from "../../components/ShopItem/ShopItem";
import { useAppSelector } from "../../services/reduxHooks";

const Shop: FC = () => {
  const navigate = useNavigate();
  const [goods, setGoods] = useState(shopItems);
  // const userSkins = useAppSelector(store => store.user.userData?.info.collectibles);
  const userSkins = [1, 2, 5];
  const handleShowCollectibles = () => {
    if (userSkins.length > 0) {
      const filteredItems = shopItems.filter((item: any) => userSkins.includes(item.id));
      setGoods(filteredItems);
    } else {
      setGoods(shopItems);
    }
  };

  const handleCancelSort = () => {
    setGoods(shopItems);
  };

  const handleShowFlea = () => {
    setGoods(userSkinsForSale);
  }

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
          <button 
          className={styles.shop__button} 
          onClick={handleCancelSort}>
            Магазин
          </button>
          <button 
          className={styles.shop__button}
          onClick={handleShowFlea}
          >
            Лавка
          </button>
        </div>
        <button
          className={styles.shop__buttonWhite}
          onClick={handleShowCollectibles}
        >
          Приобретено
        </button>
      </div>
      <div className={styles.shop__goods}>
        {goods.map((item: any, index: number) => (
          <ShopItem item={item} index={index} />
        )
        )}
      </div>
    </div>
  )
}

export default Shop;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './Shop.module.scss';
import UserInfo from "../../components/User/SecondaryUserInfo/SecondaryUserInfo";
import { useNavigate } from "react-router-dom";
import { shopItems, userSkinsForSale } from "../../utils/mockData";
import ShopItem from "../../components/Shopping/ShopItem/ShopItem";
import { useAppSelector } from "../../services/reduxHooks";
import Overlay from "../../components/Overlay/Overlay";
import Product from '../../components/Shopping/Product/Product';
import useTelegram from "../../hooks/useTelegram";

const Shop: FC = () => {
  const navigate = useNavigate();
  const { tg } = useTelegram();
  const [goods, setGoods] = useState(shopItems);
  const [activeButton, setActiveButton] = useState('Магазин');
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };
  // const userSkins = useAppSelector(store => store.user.userData?.info.collectibles);
  const userSkins = shopItems.filter((item: any) => item.isOwned === true);
  console.log(userSkins);
  useEffect(() => {
    setActiveButton('Магазин');
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, []);

  const handleShowCollectibles = () => {
    if (userSkins) {
      // const filteredItems = shopItems.filter((item: any) => item.isOwned === true);
      setGoods(userSkins);
    } else {
      setGoods(shopItems);
    }
    setActiveButton('Приобретено');
  };

  const handleCancelSort = () => {
    setGoods(shopItems);
    setActiveButton('Магазин');
  };

  const handleShowFlea = () => {
    setGoods(userSkinsForSale);
    setActiveButton('Лавка');
  };

  const handleShowItemDetails = (item: any) => {
    setSelectedItem(item);
    toggleOverlay();
  };

  return (
    <div className={styles.shop}>
      <div className={styles.shop__header}>
        <h2 className={styles.shop__title}>Магазин</h2>
        <UserInfo />
      </div>
      <div className={`${styles.shop__content} ${showOverlay ? styles.hidden : ''}`}>
        <div className={styles.shop__buttons}>
          <div className={styles.shop__leftButtonsContainer}>
            <button
              className={`${styles.shop__button} ${activeButton === 'Магазин' ? styles.activeButton : ''}`}
              onClick={handleCancelSort}>
              Магазин
            </button>
            <button
              className={`${styles.shop__button} ${activeButton === 'Лавка' ? styles.activeButton : ''}`}
              onClick={handleShowFlea}
            >
              Лавка
            </button>
          </div>
          <button
            className={`${styles.shop__button} ${activeButton === 'Приобретено' ? styles.activeButton : ''}`}
            onClick={handleShowCollectibles}
          >
            Приобретено
          </button>
        </div>
        <div className={styles.shop__goods}>
          {goods.map((item: any, index: number) => (
            <ShopItem item={item} index={index} onClick={() => handleShowItemDetails(item)} />
          )
          )}
        </div>
      </div>
      <Overlay
        show={showOverlay}
        onClose={toggleOverlay}
        children={
          <Product
            item={selectedItem}
            onClose={toggleOverlay}
            activeButton={activeButton}
          />}
      />
    </div>
  )
}

export default Shop;
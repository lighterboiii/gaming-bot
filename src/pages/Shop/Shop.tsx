/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './Shop.module.scss';
import UserInfo from "../../components/User/SecondaryUserInfo/SecondaryUserInfo";
import { useNavigate } from "react-router-dom";
import { shopItems, userSkinsForSale } from "../../utils/mockData";
import ShopItem from "../../components/Shopping/ShopItem/ShopItem";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import Overlay from "../../components/Overlay/Overlay";
import Product from '../../components/Shopping/Product/Product';
import useTelegram from "../../hooks/useTelegram";
import { getReq } from "../../api/api";
import { getDailyBonusUri, getShopAvailableUri, userId } from "../../api/requestData";
import { setShopData } from "../../services/shopSlice";
import Loader from "../../components/Loader/Loader";

const Shop: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const shopData = useAppSelector(store => store.shop.products?.shop);
  const userSkins = useAppSelector(store => store.user.userData?.info.collectibles);

  const [goods, setGoods] = useState([]);
  const [activeButton, setActiveButton] = useState('Магазин');
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  useEffect(() => {
    setGoods(shopData);
  }, [shopData])

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const fetchData = async () => {
      try {
        const isDailyBonusActive = await getReq<string>({ uri: getDailyBonusUri, userId: userId });
        const shopGoods = await getReq<any>({ uri: getShopAvailableUri, userId: '' });
        dispatch(setShopData(shopGoods))
      } catch (error) {
        console.log(error);
      };
      setLoading(false);
    }
    fetchData();
    setActiveButton('Магазин');
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, []);

  const handleShowCollectibles = () => {
    // if (userSkins) {
    //   const filteredItems = [];
    //   userSkins.forEach((userSkinId) => {
    //     const foundItem = shopData.find((item) => item.id === userSkinId);
    //     if (foundItem) {
    //       filteredItems.push(foundItem);
    //     }
    //   });
    //   setGoods(userSkins);
    // } else {
    //   setGoods(shopData);
    // }
    setGoods([]);
    setActiveButton('Приобретено');
  };

  const handleCancelSort = () => {
    setGoods(shopData);
    setActiveButton('Магазин');
  };

  const handleShowFlea = () => {
    // setGoods(userSkinsForSale);
    setActiveButton('Лавка');
  };

  const handleShowItemDetails = (item: any) => {
    setSelectedItem(item);
    console.log(item);
    toggleOverlay();
  };

  return (
    <div className={styles.shop}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.shop__header}>
            <h2 className={styles.shop__title}>Магазин</h2>
            <UserInfo />
          </div><div className={`${styles.shop__content} ${showOverlay ? styles.hidden : ''}`}>
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
              {goods?.length > 0 ? (
                <>
                  {goods.map((item: any, index: number) => (
                    <ShopItem item={item} index={index} onClick={() => handleShowItemDetails(item)} key={index} />
                  )
                  )}
                </>
              ) : (
                <div style={{ color: '#FFF' }}>Ничего нет :с</div>
              )}
            </div>
          </div><Overlay
            show={showOverlay}
            onClose={toggleOverlay}
            children={<Product
              item={selectedItem}
              onClose={toggleOverlay}
              activeButton={activeButton} />} />
        </>
      )}
    </div>
  )
}

export default Shop;
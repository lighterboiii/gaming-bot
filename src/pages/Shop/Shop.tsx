/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './Shop.module.scss';
import UserInfo from "../../components/User/SecondaryUserInfo/SecondaryUserInfo";
import { useNavigate } from "react-router-dom";
import { userSkinsForSale } from "../../utils/mockData";
import ShopItem from "../../components/Shopping/ShopItem/ShopItem";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import Overlay from "../../components/Overlay/Overlay";
import Product from '../../components/Shopping/Product/Product';
import useTelegram from "../../hooks/useTelegram";
import { getReq } from "../../api/api";
import { getDailyBonusUri, getShopAvailableUri, userId } from "../../api/requestData";
import { setShopData } from "../../services/shopSlice";
import Loader from "../../components/Loader/Loader";
import { ItemData } from "../../utils/types";

const Shop: FC = () => {
  const { tg, user } = useTelegram();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const shopData = useAppSelector(store => store.shop.products?.shop);
  const collectibles = useAppSelector(store => store.user.userData?.info.collectibles);

  const [goods, setGoods] = useState<ItemData[]>([]);
  const [activeButton, setActiveButton] = useState('Магазин');
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(false);
  // сделать бонус
  const [dailyBonus, setDailyBonus] = useState<any>()
  // console.log(dailyBonus);
  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };
// при изменении данных
  useEffect(() => {
    switch (activeButton) {
      case "Магазин": {
        const shopDataWithCollectible = shopData?.map((item: ItemData) => ({
          ...item,
          isCollectible: collectibles?.includes(item.item_id),
        }));
        setGoods(shopDataWithCollectible);
        break;
      }
      case "Лавка": {
        setGoods(userSkinsForSale);
        break;
      }
      default:
        break;
    }
  }, [shopData, collectibles, activeButton]);
  // при монтировании компонента
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // const isDailyBonusActive = await getReq<string>({ uri: getDailyBonusUri, userId: user?.id });
        // console.log(isDailyBonusActive);
        // setDailyBonus(isDailyBonusActive);
        const shopGoods = await getReq<any>({ uri: getShopAvailableUri, userId: '' });
        dispatch(setShopData(shopGoods));
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
// открыть страничку с данными скина
  const handleShowItemDetails = (item: ItemData) => {
    setSelectedItem(item);
    toggleOverlay();
  };
// обработчик клика по кнопке "приобретено"
  const handleClickInventory = () => {
    setActiveButton("Приобретено");
    const collectibleIds = collectibles?.map(id => Number(id));
    const inventoryItems = shopData.filter((item: ItemData) => collectibleIds?.includes(item.item_id));
    const inventoryDataWithCollectible = inventoryItems?.map((item: ItemData) => ({
      ...item,
      isCollectible: collectibleIds?.includes(item.item_id),
    }));
    setGoods(inventoryDataWithCollectible);
  };
  const handleClickShop = () => {
    setActiveButton("Магазин");
    const shopDataWithCollectible = shopData?.map((item: ItemData) => ({
      ...item,
      isCollectible: collectibles?.includes(item.item_id),
    }));
    setGoods(shopDataWithCollectible);
  };

  return (
    <div className={styles.shop}>
      {loading ? <Loader /> : (
        <>
          {/* {dailyBonus.bonus !== 'no' ? (
            <div>{dailyBonus}</div>
          ) : ( */}
            <>
              <div className={styles.shop__header}>
                <h2 className={styles.shop__title}>Магазин</h2>
                <UserInfo />
              </div><div className={`${styles.shop__content} ${showOverlay ? styles.hidden : ''}`}>
                <div className={styles.shop__buttons}>
                  <div className={styles.shop__leftButtonsContainer}>
                    <button
                      className={`${styles.shop__button} ${activeButton === 'Магазин' ? styles.activeButton : ''}`}
                      onClick={handleClickShop}>
                      Магазин
                    </button>
                    <button
                      className={`${styles.shop__button} ${activeButton === 'Лавка' ? styles.activeButton : ''}`}
                      onClick={() => setActiveButton('Лавка')}>
                      Лавка
                    </button>
                  </div>
                  <button
                    className={`${styles.shop__button} ${activeButton === 'Приобретено' ? styles.activeButton : ''}`}
                    onClick={handleClickInventory}
                  >
                    Приобретено
                  </button>
                </div>
                <div className={styles.shop__goods}>
                  {goods?.length > 0 ? (
                    <>
                      {goods.map((item: ItemData, index: number) => (
                        <ShopItem
                          item={item}
                          index={index}
                          onClick={() => handleShowItemDetails(item)} key={index} />
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
                  isCollectible={selectedItem?.isCollectible} />} />
            </>
          {/* )} */}
        </>
      )}
    </div>
  )
}

export default Shop;
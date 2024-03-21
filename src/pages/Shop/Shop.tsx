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
import { Bonus, ItemData } from "../../utils/types";
import DailyBonus from "../../components/Shopping/Bonus/Bonus";

const Shop: FC = () => {
  const { tg, user } = useTelegram();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const shopData = useAppSelector(store => store.shop.products?.shop);
  const collectibles = useAppSelector(store => store.user.info?.collectibles);
  const archive = useAppSelector(store => store.shop.archive);

  const [goods, setGoods] = useState<ItemData[]>([]);
  const [activeButton, setActiveButton] = useState<string>('Магазин');

  const [showOverlay, setShowOverlay] = useState(false);
  const [showBonusOverlay, setShowBonusOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [dailyBonusData, setDailyBonusData] = useState<any>()

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };
  // добавить флаг isCollectible жкаждому товару
  const handleAddIsCollectible = (data: any) => {
    const collectibleIds = collectibles?.map(id => Number(id));
    const shopDataWithCollectible = data?.map((item: ItemData) => ({
      ...item,
      isCollectible: collectibleIds?.includes(item.item_id),
    }));
    setGoods(shopDataWithCollectible);
  }
  // при изменении данных
  useEffect(() => {
    switch (activeButton) {
      case "Магазин": {
        handleAddIsCollectible(shopData);
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
    const fetchShopData = async () => {
      try {
        const isDailyBonusActive = await getReq<any>({ uri: getDailyBonusUri, userId: userId });
        setDailyBonusData(isDailyBonusActive);
        const shopGoods = await getReq<ItemData[]>({ uri: getShopAvailableUri, userId: '' });
        dispatch(setShopData(shopGoods));
      } catch (error) {
        console.log(error);
      };
      setLoading(false);
    }
    fetchShopData();
    setActiveButton('Магазин');
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, []);
  // показать окно бонуса или нет
  useEffect(() => {
    dailyBonusData?.bonus !== 'no' ? setShowBonusOverlay(true) : setShowBonusOverlay(false);
  }, [dailyBonusData])
  // открыть страничку с данными скина
  const handleShowItemDetails = (item: ItemData) => {
    setSelectedItem(item);
    toggleOverlay();
  };
  // обработчик клика по кнопке "приобретено"
  const handleClickInventory = () => {
    setActiveButton("Приобретено");
    const collectibleIds = collectibles?.map(id => Number(id));
    const inventoryItems = archive.filter((item: ItemData) => collectibleIds?.includes(item.item_id));
    const inventoryDataWithCollectible = inventoryItems?.map((item: ItemData) => ({
      ...item,
      isCollectible: collectibleIds?.includes(item.item_id),
    }));
    setGoods(inventoryDataWithCollectible);
  };
  // обработчик клика по кнопке "магазин"
  const handleClickShop = () => {
    setActiveButton("Магазин");
    handleAddIsCollectible(archive);
  };

  return (
    <div className={styles.shop}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.shop__header}>
            <h2 className={styles.shop__title}>Магазин</h2>
            <UserInfo />
          </div><div className={`${styles.shop__content} ${(showOverlay || showBonusOverlay) ? styles.hidden : ''}`}>
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
                  className={`${styles.shop__button} ${styles.shop__inventory} ${activeButton === 'Приобретено' ? styles.activeButton : ''}`}
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
                      key={index}
                      item={item}
                      onClick={() => handleShowItemDetails(item)}
                      activeButton={activeButton}
                    />
                  )
                  )}
                </>
              ) : (
                <div style={{ color: '#FFF' }}>Ничего нет :с</div>
              )}
            </div>
          </div>
          <Overlay
            closeButton
            show={showOverlay}
            onClose={toggleOverlay}
            children={
              <Product
                item={selectedItem}
                onClose={toggleOverlay}
                isCollectible={selectedItem?.isCollectible}
              />}
          />
          {dailyBonusData &&
            <Overlay
              closeButton
              show={showBonusOverlay}
              onClose={() => setShowBonusOverlay(false)}
              children={
                <DailyBonus
                  bonus={dailyBonusData}
                  closeOverlay={() => setShowBonusOverlay(!showBonusOverlay)}
                />}
            />}
        </>
      )}
    </div>
  )
}

export default Shop;
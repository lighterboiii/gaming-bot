/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './Shop.module.scss';
import UserInfo from "../../components/User/SecondaryUserInfo/SecondaryUserInfo";
import { useNavigate } from "react-router-dom";
import ShopItem from "../../components/Shopping/ShopItem/ShopItem";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import Overlay from "../../components/Overlay/Overlay";
import Product from '../../components/Shopping/Product/Product';
import useTelegram from "../../hooks/useTelegram";
import { getReq } from "../../api/api";
import { mainAppDataUri, userId } from "../../api/requestData";
import Loader from "../../components/Loader/Loader";
import { Bonus, IAppData, ItemData } from "../../utils/types";
import DailyBonus from "../../components/Shopping/Bonus/Bonus";
import { setDailyBonus, setLavkaAvailable, setShopAvailable } from "../../services/appSlice";

const Shop: FC = () => {
  const { tg, user } = useTelegram();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const shopData = useAppSelector(store => store.app.products);
  const collectibles = useAppSelector(store => store.app.info?.collectibles);
  const archiveData = useAppSelector(store => store.app.archive);
  const lavkaAvailable = useAppSelector(store => store.app.lavka);

  const [goods, setGoods] = useState<ItemData[]>([]);
  const [activeButton, setActiveButton] = useState<string>('Магазин');

  const [showOverlay, setShowOverlay] = useState(false);
  const [showBonusOverlay, setShowBonusOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [dailyBonusData, setDailyBonusData] = useState<Bonus | null>(null);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };
  // функция отрисовки предметов инвентаря
  const handleRenderInventoryData = () => {
    const collectibleIds = collectibles?.map(id => Number(id));
    const inventoryItems = archiveData!.filter((item: ItemData) => collectibleIds?.includes(item.item_id));
    const inventoryDataWithCollectible = inventoryItems?.map((item: ItemData) => ({
      ...item,
      isCollectible: collectibleIds?.includes(item.item_id),
    }));
    setGoods(inventoryDataWithCollectible);
  };
  // добавить флаг isCollectible жкаждому товару
  const handleAddIsCollectible = (data: ItemData[]) => {
    const collectibleIds = collectibles?.map(id => Number(id));
    const shopDataWithCollectible = data?.map((item: ItemData) => ({
      ...item,
      isCollectible: collectibleIds?.includes(item.item_id),
    }));
    setGoods(shopDataWithCollectible);
  }
    // при монтировании компонента
    useEffect(() => {
      setLoading(true);
      shopData && setGoods(shopData);
      const fetchShopData = async () => {
        try {
          const res = await getReq<IAppData>({
            uri: mainAppDataUri,
            // userId: userId,
            userId: user?.id,
          });
          dispatch(setLavkaAvailable(res.lavka_available));
          dispatch(setShopAvailable(res.shop_available));
          dispatch(setDailyBonus(res.daily_bonus));
          setDailyBonusData(res.daily_bonus);
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
      dailyBonusData ? setShowBonusOverlay(true) : setShowBonusOverlay(false);
    }, [dailyBonusData])
    // открыть страничку с данными скина
    const handleShowItemDetails = (item: ItemData) => {
      setSelectedItem(item);
      toggleOverlay();
    };
  // при изменении данных
  useEffect(() => {
    switch (activeButton) {
      case "Магазин": {
        shopData && handleAddIsCollectible(shopData);
        break;
      }
      case "Лавка": {
        setGoods(lavkaAvailable);
        break;
      }
      case "Приобретено": {
        handleRenderInventoryData();
        break;
      }
      default:
        break;
    }
  }, [shopData, collectibles, activeButton, lavkaAvailable]);
  // обработчик клика по кнопке "приобретено"
  const handleClickInventory = () => {
    setActiveButton("Приобретено");
    handleRenderInventoryData();
  };
  // обработчик клика по кнопке "магазин"
  const handleClickShop = () => {
    setActiveButton("Магазин");
    archiveData && handleAddIsCollectible(archiveData);
  };

  return (
    <div className={styles.shop}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.shop__header}>
            <h2 className={styles.shop__title}>Магазин</h2>
            <UserInfo />
          </div>
          <div className={`${styles.shop__content} ${(showOverlay || showBonusOverlay) ? styles.hidden : ''}`}>
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
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCollectiblesInfo, getLavkaAvailableRequest, getShopItemsRequest } from "../../api/shopApi";
import Overlay from "../../components/Overlay/Overlay";
import Product from '../../components/Shopping/Product/Product';
import ProductSkeleton from '../../components/Shopping/ProductSkeleton/ProductSkeleton';
import ShopItem from "../../components/Shopping/ShopItem/ShopItem";
import UserInfo from "../../components/User/SecondaryUserInfo/SecondaryUserInfo";
import useTelegram from "../../hooks/useTelegram";
import { setLavkaAvailable } from "../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { triggerHapticFeedback } from "../../utils/hapticConfig";
import { cacheCollectibles } from "../../utils/imageCache";
import { indexUrl } from "../../utils/routes";
import { IInventoryRequest } from "../../utils/types/responseTypes";
import { CombinedItemData, ItemData, LavkaResponse } from "../../utils/types/shopTypes";
import { getUserId } from "../../utils/userConfig";

import styles from './Shop.module.scss';

interface ShopResponse {
  shop: ItemData[];
}

export const Shop: FC = () => {
  const { tg } = useTelegram();
  const dispatch = useAppDispatch();
  const userId = getUserId();
  const navigate = useNavigate();
  const shopData = useAppSelector(store => store.app.products);
  const collectibles = useAppSelector(store => store.app.info?.collectibles);
  const lavkaShop = useAppSelector(store => store.app.lavka);
  const translation = useAppSelector(store => store.app.languageSettings);
  const [goods, setGoods] = useState<ItemData[]>([]);
  const [activeButton, setActiveButton] = useState<string>(`${translation?.shop_button}`);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CombinedItemData | null>(null);
  const [inventoryItems, setInventoryItems] = useState<ItemData[]>([]);

  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(indexUrl);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, [tg, navigate]);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };
  // функция отрисовки предметов инвентаря
  const handleRenderInventoryData = () => {
    setLoading(true);
    setGoods(inventoryItems);
    const inventoryDataWithCollectible = inventoryItems?.map((item: ItemData) => ({
      ...item,
      isCollectible: true,
    }));
    setGoods(inventoryDataWithCollectible);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };
  // добавить флаг isCollectible жкаждому товару
  const handleAddIsCollectible = useCallback((data: ItemData[]) => {
    const collectibleIds = collectibles?.map(id => Number(id));
    const shopDataWithCollectible = data?.map((item: ItemData) => ({
      ...item,
      isCollectible: collectibleIds?.includes(item.item_id),
    }));
    setGoods(shopDataWithCollectible);
  }, [collectibles]);
  // при монтировании компонента
  useEffect(() => {
    const initializeShop = async () => {
      setLoading(true);
      setActiveButton(`${translation?.shop_button}`);
      
      try {
        const response = await getCollectiblesInfo(userId) as IInventoryRequest;
        setInventoryItems(response?.message);
        
        if (shopData) {
          await cacheCollectibles(shopData);
          
          const freshShopData = await getShopItemsRequest() as ShopResponse;
          handleAddIsCollectible(freshShopData.shop);
          setGoods(freshShopData.shop);
        }
      } catch (error) {
        console.error('Error initializing shop:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeShop();
  }, [handleAddIsCollectible, shopData, translation?.shop_button, userId]);
  // открыть страничку с данными скина
  const handleShowItemDetails = (item: CombinedItemData) => {
    setSelectedItem(item);
    toggleOverlay();
  };
  // обработчик клика по кнопке "приобретено"
  const handleClickInventory = () => {
    triggerHapticFeedback('impact', 'soft');
    setActiveButton(`${translation?.purchased}`);
    handleRenderInventoryData();
  };
  // обработчик клика по кнопке "магазин"
  const handleClickShop = async () => {
    setLoading(true);
    triggerHapticFeedback('impact', 'soft');
    setActiveButton(`${translation?.shop_button}`);
    
    try {
      const freshShopData = await getShopItemsRequest() as ShopResponse;
      handleAddIsCollectible(freshShopData.shop);
    } catch (error) {
      console.error('Error refreshing shop data:', error);
    } finally {
      setLoading(false);
    }
  };
  // обработчик клика по кнопке "лавка"
  const handleClickLavka = async () => {
    setLoading(true);
    triggerHapticFeedback('impact', 'soft');
    setActiveButton(`${translation?.marketplace}`);
    
    try {
      const updatedLavka: LavkaResponse = await getLavkaAvailableRequest() as LavkaResponse;
      dispatch(setLavkaAvailable(updatedLavka.lavka));
      await cacheCollectibles(updatedLavka.lavka);
      setGoods(updatedLavka.lavka);
    } catch (error) {
      console.error('Error loading lavka:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeButton === `${translation?.marketplace}`) {
      lavkaShop && setGoods(lavkaShop);
    }
  }, [lavkaShop, activeButton, translation?.marketplace])

  const updateItemCount = () => {
    getShopItemsRequest()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        setGoods(res.shop);
      })
  };

  return (
    <main className={styles.shop}>
      <header className={styles.shop__header}>
        <h1 className={styles.shop__title}>{translation?.shop_menu}</h1>
        <UserInfo />
      </header>
      <section className={`${styles.shop__content} ${showOverlay ? styles.hidden : ''}`}>
        <nav className={`${styles.shop__buttons} ${showOverlay ? styles.hidden : ''}`}>
          <div className={styles.shop__leftButtonsContainer}>
            <button
              aria-pressed={activeButton === `${translation?.shop_button}`}
              className={
                `${styles.shop__button} ${activeButton === `${translation?.shop_button}` ? styles.activeButton : ''}`
              }
              onClick={handleClickShop}
              disabled={loading}
            >
              {translation?.shop_button}
            </button>
            <button
              aria-pressed={activeButton === `${translation?.marketplace}`}
              className={
                `${styles.shop__button} ${activeButton === `${translation?.marketplace}` ? styles.activeButton : ''}`
              }
              onClick={handleClickLavka}
              disabled={loading}
            >
              {translation?.marketplace}
            </button>
          </div>
          <button
            aria-pressed={activeButton === `${translation?.purchased}`}
            className={
              `${styles.shop__button} 
              ${styles.shop__inventory} 
              ${activeButton === `${translation?.purchased}` ? styles.activeButton : ''}`
            }
            onClick={handleClickInventory}
            disabled={loading}
          >
            {translation?.purchased}
          </button>
        </nav>
        {loading ? (
          <section className={styles.shop__goods + ' scrollable'} aria-label="Loading items">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </section>
        ) : (
          <section className={styles.shop__goods + ' scrollable'} aria-label="Shop items">
            {goods?.length > 0 ? (
              <>
                {goods.map((item: ItemData, index: number) => (
                  <li key={index} className={styles.shop__item}>
                    <ShopItem
                      item={item}
                      onClick={() => handleShowItemDetails(item)}
                      activeButton={activeButton}
                    />
                  </li>
                ))}
              </>
            ) : (
              <p role="status" aria-live="polite" style={{ color: '#ffdb50', fontWeight: '900' }}>
                {translation?.empty_here}
              </p>
            )}
          </section>
        )}
      </section>
      {selectedItem && <Overlay
        buttonColor="#FFF"
        crossColor="#ac1a44"
        closeButton
        show={showOverlay}
        onClose={toggleOverlay}
        children={
          <Product
            activeButton={activeButton}
            item={selectedItem}
            onClose={toggleOverlay}
            isCollectible={selectedItem?.isCollectible}
            updateItemCount={updateItemCount}
          />}
      />}
    </main>
  )
};

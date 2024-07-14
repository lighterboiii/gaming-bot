/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLavkaAvailableRequest } from "../../api/shopApi";
import Overlay from "../../components/Overlay/Overlay";
import Product from '../../components/Shopping/Product/Product';
import ShopItem from "../../components/Shopping/ShopItem/ShopItem";
import UserInfo from "../../components/User/SecondaryUserInfo/SecondaryUserInfo";
import useTelegram from "../../hooks/useTelegram";
import { setLavkaAvailable } from "../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import { indexUrl } from "../../utils/routes";
import { CombinedItemData, ItemData, LavkaResponse } from "../../utils/types/shopTypes";

import styles from './Shop.module.scss';

export const Shop: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shopData = useAppSelector(store => store.app.products);
  const collectibles = useAppSelector(store => store.app.info?.collectibles);
  const archiveData = useAppSelector(store => store.app.archive);
  const lavkaShop = useAppSelector(store => store.app.lavka);
  const translation = useAppSelector(store => store.app.languageSettings);
  const [goods, setGoods] = useState<ItemData[]>([]);
  const [activeButton, setActiveButton] = useState<string>(`${translation?.shop_button}`);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CombinedItemData | null>(null);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };
  // функция отрисовки предметов инвентаря
  const handleRenderInventoryData = () => {
    if (!archiveData) {
      return;
    }
    const collectibleIds = collectibles?.map(id => Number(id));
    const inventoryItems = archiveData.filter((item: ItemData) => collectibleIds?.includes(item.item_id));
    const inventoryDataWithCollectible = inventoryItems?.map((item: ItemData) => ({
      ...item,
      isCollectible: collectibleIds?.includes(item.item_id),
    }));
    setGoods(inventoryDataWithCollectible);
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
    setActiveButton(`${translation?.shop_button}`);
    shopData && setGoods(shopData);
    shopData && handleAddIsCollectible(shopData);
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(indexUrl);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, [handleAddIsCollectible, navigate, shopData, tg.BackButton, translation?.shop_button]);
  // открыть страничку с данными скина
  const handleShowItemDetails = (item: CombinedItemData) => {
    setSelectedItem(item);
    toggleOverlay();
  };
  // обработчик клика по кнопке "приобретено"
  const handleClickInventory = () => {
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
    setActiveButton(`${translation?.purchased}`);
    handleRenderInventoryData();
  };
  // обработчик клика по кнопке "магазин"
  const handleClickShop = () => {
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
    setActiveButton(`${translation?.shop_button}`);
    shopData && handleAddIsCollectible(shopData);
  };
  // обработчик клика по кнопке "лавка"
  const handleClickLavka = async () => {
    setLoading(true);
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
    setActiveButton(`${translation?.marketplace}`);
    const updatedLavka: LavkaResponse = await getLavkaAvailableRequest() as LavkaResponse;
    dispatch(setLavkaAvailable(updatedLavka.lavka));
    setGoods(updatedLavka.lavka);
    setLoading(false);
  };

  useEffect(() => {
    if (activeButton === `${translation?.marketplace}`) {
      lavkaShop && setGoods(lavkaShop);
    }
  }, [lavkaShop, activeButton, translation?.marketplace])

  const updateItemCount = (itemId: number) => {
    setGoods((prevGoods: ItemData[]) =>
      prevGoods.map((item: ItemData) => {
        if (item.item_id === itemId) {
          const itemCount = item.item_count ?? 0;
          return { ...item, item_count: itemCount > 0 ? itemCount - 1 : 0 };
        }
        return item;
      }));
  };

  return (
    <div className={styles.shop}>
      <div className={styles.shop__header}>
        <h2 className={styles.shop__title}>{translation?.shop_menu}</h2>
        <UserInfo />
      </div>
      <div className={`${styles.shop__content} ${showOverlay ? styles.hidden : ''}`}>
        <div className={styles.shop__buttons}>
          <div className={styles.shop__leftButtonsContainer}>
            <button
              className={
                `${styles.shop__button} ${activeButton === `${translation?.shop_button}` ? styles.activeButton : ''}`
              }
              onClick={handleClickShop}>
              {translation?.shop_button}
            </button>
            <button
              className={
                `${styles.shop__button} ${activeButton === `${translation?.marketplace}` ? styles.activeButton : ''}`
              }
              onClick={handleClickLavka}>
              {translation?.marketplace}
            </button>
          </div>
          <button
            className={
              `${styles.shop__button} 
              ${styles.shop__inventory} 
              ${activeButton === `${translation?.purchased}` ? styles.activeButton : ''}`
            }
            onClick={handleClickInventory}
          >
            {translation?.purchased}
          </button>
        </div>
        {loading ? <p style={{ color: '#ffdb50', fontWeight: '900' }}>{translation?.loading}...</p> : (
          <>
            <div className={styles.shop__goods + ' scrollable'}>
              {goods?.length > 0 ? (
                <>
                  {goods.map((item: ItemData, index: number) => (
                    <ShopItem
                      key={index}
                      item={item}
                      onClick={() => handleShowItemDetails(item)}
                      activeButton={activeButton}
                    />
                  ))}
                </>
              ) : (
                <p style={{ color: '#ffdb50', fontWeight: '900' }}>{translation?.empty_here}</p>
              )}
            </div>
          </>
        )
        }
      </div>
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
    </div >
  )
};


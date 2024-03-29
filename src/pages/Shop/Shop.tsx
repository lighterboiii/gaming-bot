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
import { GoodsItem, ItemData, LavkaResponse } from "../../utils/types/shopTypes";
import { getLavkaAvailableRequest } from "../../api/shopApi";
import { setLavkaAvailable } from "../../services/appSlice";
import { postEvent } from "@tma.js/sdk";

const Shop: FC = () => {
  const { tg, user } = useTelegram();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shopData = useAppSelector(store => store.app.products);
  const collectibles = useAppSelector(store => store.app.info?.collectibles);
  const archiveData = useAppSelector(store => store.app.archive);
  const lavkaShop = useAppSelector(store => store.app.lavka);

  const [goods, setGoods] = useState<GoodsItem[]>([]);
  const [activeButton, setActiveButton] = useState<string>('Магазин');

  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);

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
  };
  // при монтировании компонента
  useEffect(() => {
    setActiveButton('Магазин');
    shopData && setGoods(shopData);
    shopData && handleAddIsCollectible(shopData);
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
    postEvent('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: 'soft',
    });
    setActiveButton("Приобретено");
    handleRenderInventoryData();
  };
  // обработчик клика по кнопке "магазин"
  const handleClickShop = () => {
    postEvent('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: 'soft',
    });
    setActiveButton("Магазин");
    shopData && handleAddIsCollectible(shopData);
  };
  // обработчик клика по кнопке "лавка"
  const handleClickLavka = async () => {
    setLoading(true);
    postEvent('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: 'soft',
    });
    setActiveButton("Лавка");
    const updatedLavka: LavkaResponse = await getLavkaAvailableRequest() as LavkaResponse;
    dispatch(setLavkaAvailable(updatedLavka.lavka));
    setGoods(updatedLavka.lavka);
    setLoading(false);
  };

  useEffect(() => {
    if (activeButton === "Лавка") {
      lavkaShop && setGoods(lavkaShop);
    }
  }, [lavkaShop, activeButton])

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
              onClick={handleClickShop}>
              Магазин
            </button>
            <button
              className={`${styles.shop__button} ${activeButton === 'Лавка' ? styles.activeButton : ''}`}
              onClick={handleClickLavka}>
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
        {loading ?  <p style={{ color: '#ffdb50', fontWeight: '900' }}>Загрузка...</p>: (
          <>
            <div className={styles.shop__goods + ' scrollable'}>
              {goods?.length > 0 ? (
                <>
                  {goods.map((item: GoodsItem, index: number) => (
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
                <p style={{ color: '#ffdb50', fontWeight: '900' }}>Ничего нет :с</p>
              )}
            </div>
          </>
            )
          }
          </div>
      <Overlay
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
          />}
      />
    </div >
  )
};

export default Shop;
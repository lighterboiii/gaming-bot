/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useState } from "react";

import { userId } from "../../../api/requestData";
import {
  buyItemRequest,
  buyLavkaRequest,
  cancelLavkaRequest,
  getShopItemsRequest,
  setActiveEmojiRequest,
  setActiveSkinRequest
} from "../../../api/shopApi";
import useTelegram from "../../../hooks/useTelegram";
import {
  addEnergyDrink,
  removeItemFromLavka,
  setActiveEmoji,
  setActiveSkin,
  setCoinsValueAfterBuy,
  setCollectibles,
  setTokensValueAfterBuy
} from "../../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../../services/reduxHooks";
import { IBuyItemRes } from "../../../utils/types/responseTypes";
import { CombinedItemData, ItemData } from "../../../utils/types/shopTypes";
import { Modal } from "../../Modal/Modal";
import Button from "../../ui/Button/Button";
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import SellForm from "../SellForm/SellForm";

import styles from './Product.module.scss';

interface ProductProps {
  item: CombinedItemData;
  onClose: () => void;
  isCollectible?: boolean;
  activeButton?: string;
  updateItemCount: (itemId: number) => void;
}

const Product: FC<ProductProps> = ({ item, onClose, isCollectible, activeButton, updateItemCount }) => {
  const { user, tg } = useTelegram();
  // const userId = user?.id;
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  // для отрисовки интерфейса продажи айтема
  const isUserSeller = Number(userId) === Number(item?.seller_id);
  const translation = useAppSelector(store => store.app.languageSettings);
  // функция для фильтрации купленных товаров
  const handlePurchaseItemTypes = async (item: ItemData) => {
    item?.item_price_coins !== 0
      ? dispatch(setCoinsValueAfterBuy(item.item_price_coins))
      : dispatch(setTokensValueAfterBuy(item.item_price_tokens));
    if (item?.item_type === "skin" || item?.item_type === "skin_anim") {
      dispatch(setCollectibles(item.item_id));
      dispatch(setActiveSkin(item.item_id));
      await setActiveSkinRequest(item.item_id, userId);
    } else if (item?.item_type === "energy_drink") {
      dispatch(addEnergyDrink(1));
    } else if (item?.item_type === "emoji") {
      dispatch(setCollectibles(item.item_id));
      await setActiveEmojiRequest(userId, item?.item_id);
    }
  };
  // закрытие с задержкой
  function closeWithDelay(
    onClose: () => void,
    setMessage: (arg: string) => void,
    setMessageShown: (arg: boolean) => void,
    closeDelay = 1000,
    messageResetDelay = 200
  ) {
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        setMessage('');
        setMessageShown(false);
      }, messageResetDelay);

    }, closeDelay);
  }
  // хендлер покупки
  const handleBuyShopItem = (item: ItemData) => {
    buyItemRequest(item.item_id, 1, userId)
      .then((response) => {
        const res = response as IBuyItemRes;
        setMessageShown(true);
        switch (res.message) {
          case "out":
            setMessage(`${translation?.out_of_stock}`);
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
            break;
          case "money":
            setMessage(`${translation?.insufficient_funds}`);
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
            break;
          case "ok":
            updateItemCount(item.item_id);
            getShopItemsRequest()
              .then(res => {})
            setMessage(`${translation?.successful_purchase}`);
            handlePurchaseItemTypes(item);
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success' });
            break;
          default:
            break;
        }
        closeWithDelay(onClose, setMessage, setMessageShown);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // хендлер установки скина в актив
  const handleSetActiveSkin = (itemId: number) => {
    setActiveSkinRequest(itemId, userId)
      .then(() => {
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
        dispatch(setActiveSkin(itemId));
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // хендлер установки активного пака эмодзи
  const handleSetActiveEmoji = (itemId: number) => {
    setActiveEmojiRequest(userId, item?.item_id)
      .then(() => {
        postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
        dispatch(setActiveEmoji(String(itemId)));
        onClose();
      })
      .catch((error) => {
        console.log(error);
      })
  };
  // хендлер снятия товара с продажи
  const handleCancelSelling = (itemId: number) => {
    cancelLavkaRequest(itemId, userId)
      .then(() => {
        setMessageShown(true);
        postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success' });
        setMessage(`${translation?.item_removed_from_sale}`);
        dispatch(removeItemFromLavka(itemId));
        closeWithDelay(onClose, setMessage, setMessageShown);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // закрыть попап с продажей
  const handleCloseFormModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      onClose();
      setMessage('');
      setMessageShown(false);
    }, 1000);
  };
  // хендлер покупки в лавке
  const handleBuyLavkaitem = (item: ItemData) => {
    buyLavkaRequest(item, userId)
      .then((response) => {
        const res = response as IBuyItemRes;
        setMessageShown(true);
        switch (res.message) {
          case "sold":
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
            setMessage(`${translation?.already_sold}`);
            break;
          case "money":
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
            setMessage(`${translation?.insufficient_funds}`);
            break;
          case "break":
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
            setMessage(`${translation?.item_already_owned}`);
            break;
          case "ok":
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success'});
            setMessage(`${translation?.purchased_from_market}`);
            handlePurchaseItemTypes(item);
            break;
          default:
            break;
        }
        closeWithDelay(onClose, setMessage, setMessageShown);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.product}>
      {messageShown ? (
        <div className={styles.product__notification}>
          {message}
        </div>
      ) : (
        <>
          <div className={styles.product__avatarContainer}>
            <UserAvatar item={item} />
          </div>
          <div className={styles.product__info}>
            <div className={styles.product__textElements}>
              <p className={styles.product__type}>
                {item?.item_type === "emoji" && `${translation?.shop_type_emoji}` }
                {item?.item_type === "energy_drink" && `${translation?.shop_type_energydrink}`}
                {item?.item_type === "skin_anim" && `${translation?.shop_type_skin}`}
                {item?.item_type === "skin_png" && `${translation?.shop_type_skin}`}
                </p>
              {item?.seller_publicname &&
                <p className={styles.product__type}>
                  {translation?.main_menu_seller} {item.seller_publicname}
                </p>
              }
            </div>
            {isCollectible ? (
              <div className={styles.product__buttons}>
                <div className={styles.product__buttonWrapper}>
                  <Button
                    text={translation?.use}
                    handleClick={item?.item_type === "emoji"
                      ? () => handleSetActiveEmoji(item?.item_id)
                      : () => handleSetActiveSkin(item?.item_id)} />
                </div>
                <div className={styles.product__buttonWrapper}>
                  <Button
                    text={translation?.sell}
                    handleClick={() => setModalOpen(true)}
                    isWhiteBackground
                  />
                </div>
              </div>
            ) : isUserSeller ? (
              <div className={styles.product__buttons}>
                <div className={styles.product__buttonWrapper}>
                  <Button
                    text={translation?.remove_from_sale}
                    handleClick={() => handleCancelSelling(item?.item_id)}
                    isWhiteBackground
                  />
                </div>
              </div>
            ) : (
              <div className={styles.product__buttonWrapper}>
                {activeButton === `${translation?.marketplace}` ? (
                  <Button
                    text={item?.item_price_coins !== 0 ? `💵 ${item?.item_price_coins}` : `🔰 ${item?.item_price_tokens}`}
                    handleClick={() => handleBuyLavkaitem(item)}
                    isWhiteBackground
                  />
                ) : (
                  <Button
                    text={item?.item_price_coins !== 0 ? `💵 ${item?.item_price_coins}` : `🔰 ${item?.item_price_tokens}`}
                    handleClick={() => handleBuyShopItem(item)}
                    isWhiteBackground
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}
      {isModalOpen && (
        <Modal title={translation?.list_in_shop}
          closeModal={() => setModalOpen(false)}>
          <SellForm
            item={item}
            setMessage={setMessage}
            setMessageShown={setMessageShown}
            onClose={handleCloseFormModal} />
        </Modal>
      )}
    </div>
  );
};

export default Product;

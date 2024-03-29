/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import useTelegram from "../../../hooks/useTelegram";
import styles from './Product.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import Button from "../../ui/Button/Button";
import { useAppDispatch } from "../../../services/reduxHooks";
import { CombinedItemData, ItemData, LavkaData } from "../../../utils/types/shopTypes";
import {
  addEnergyDrink,
  removeItemFromLavka,
  setActiveEmoji,
  setActiveSkin,
  setCoinsValueAfterBuy,
  setCollectibles,
  setTokensValueAfterBuy
} from "../../../services/appSlice";
import {
  buyItemRequest,
  buyLavkaRequest,
  cancelLavkaRequest,
  setActiveEmojiRequest,
  setActiveSkinRequest
} from "../../../api/shopApi";
import { userId } from "../../../api/requestData";
import { Modal } from "../../Modal/Modal";
import SellForm from "../SellForm/SellForm";
import { postEvent } from "@tma.js/sdk";

interface ProductProps {
  item: CombinedItemData;
  onClose: () => void;
  isCollectible?: boolean;
  activeButton?: string;
}

const Product: FC<ProductProps> = ({ item, onClose, isCollectible, activeButton }) => {
  console.log(item);
  const { user, tg } = useTelegram();
  // const userId = user?.id;
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  // для отрисовки интерфейса продажи айтема
  const isUserSeller = Number(userId) === Number(item?.seller_id);
  // функция для фильтрации купленных товаров
  const handlePurchaseItemTypes = async (item: any) => {
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
  function closeWithDelay(onClose: any, setMessage: any, setMessageShown: any, closeDelay = 1000, messageResetDelay = 200) {
    setTimeout(() => {
      onClose();
  
      // Внутренний setTimeout для сброса сообщения
      setTimeout(() => {
        setMessage('');
        setMessageShown(false);
      }, messageResetDelay);
  
    }, closeDelay);
  };
  // хендлер покупки
  const handleBuyShopItem = (item: ItemData) => {
    buyItemRequest(item.item_id, 1, userId)
      .then((res: any) => {
        setMessageShown(true);
        switch (res.message) {
          case "out":
            setMessage("Товара нет в наличии");
            // postEvent('web_app_trigger_haptic_feedback', {
            //   type: 'notification',
            //   notification_type: 'error'
            // });
            break;
          case "money":
            setMessage("Недостаточно средств");
            // postEvent('web_app_trigger_haptic_feedback', {
            //   type: 'notification',
            //   notification_type: 'error'
            // });
            break;
          case "ok":
            setMessage("Успешная покупка");
            handlePurchaseItemTypes(item);
            // postEvent('web_app_trigger_haptic_feedback', {
            //   type: 'notification',
            //   notification_type: 'success'
            // });
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
        // postEvent('web_app_trigger_haptic_feedback', {
        //   type: 'impact',
        //   impact_style: 'soft',
        // });
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
          // postEvent('web_app_trigger_haptic_feedback', {
          //   type: 'impact',
          //   impact_style: 'soft',
          // });
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
        // postEvent('web_app_trigger_haptic_feedback', {
        //   type: 'notification',
        //   notification_type: 'success'
        // });
        setMessage("Товар снят с продажи");
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
  const handleBuyLavkaitem = (item: LavkaData) => {
    buyLavkaRequest(item, userId)
      .then((res: any) => {
        setMessageShown(true);
        switch (res.message) {
          case "sold":
            // postEvent('web_app_trigger_haptic_feedback', {
            //   type: 'notification',
            //   notification_type: 'error'
            // });
            setMessage("Уже продано!");
            break;
          case "money":
            // postEvent('web_app_trigger_haptic_feedback', {
            //   type: 'notification',
            //   notification_type: 'error'
            // });
            setMessage("Недостаточно средств");
            break;
          case "break":
            // postEvent('web_app_trigger_haptic_feedback', {
            //   type: 'notification',
            //   notification_type: 'error'
            // });
            setMessage("У вас уже есть этот товар");
            break;
          case "ok":
            // postEvent('web_app_trigger_haptic_feedback', {
            //   type: 'notification',
            //   notification_type: 'success'
            // });
            setMessage("Куплено из лавки!");
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
              <p className={styles.product__type}>Тип: {item?.item_type}</p>
              {item?.seller_publicname &&
                <p className={styles.product__type}>
                  Продавец: {item.seller_publicname}
                </p>
              }
            </div>
            {isCollectible ? (
              <div className={styles.product__buttons}>
                <div className={styles.product__buttonWrapper}>
                  <Button
                    text="Использовать"
                    handleClick={item?.item_type === "emoji"
                      ? () => handleSetActiveEmoji(item?.item_id)
                      : () => handleSetActiveSkin(item?.item_id)} />
                </div>
                <div className={styles.product__buttonWrapper}>
                  <Button
                    text="Продать"
                    handleClick={() => setModalOpen(true)}
                    isWhiteBackground
                  />
                </div>
              </div>
            ) : isUserSeller ? (
              <div className={styles.product__buttons}>
                <div className={styles.product__buttonWrapper}>
                  <Button
                    text="Снять с продажи"
                    handleClick={() => handleCancelSelling(item?.item_id)}
                    isWhiteBackground
                  />
                </div>
              </div>
            ) : (
              <div className={styles.product__buttonWrapper}>
                {activeButton === "Лавка" ? (
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
        <Modal title="Выставить в лавку" closeModal={() => setModalOpen(false)}>
          <SellForm item={item} setMessage={setMessage} setMessageShown={setMessageShown} onClose={handleCloseFormModal} />
        </Modal>

      )}
    </div>
  );
};

export default Product;

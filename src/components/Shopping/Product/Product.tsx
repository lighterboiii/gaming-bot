/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './Product.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import Button from "../../ui/Button/Button";
import { useAppDispatch } from "../../../services/reduxHooks";
import { ItemData } from "../../../utils/types";
import { addItemToLavka, removeCollectible, removeItemFromLavka, setActiveSkin, setCoinsValueAfterBuy, setCollectibles, setTokensValueAfterBuy } from "../../../services/appSlice";
import useTelegram from "../../../hooks/useTelegram";
import { buyItemRequest, cancelLavkaRequest, sellLavkaRequest, setActiveSkinRequest } from "../../../api/shopApi";
import { userId } from "../../../api/requestData";
import { Modal } from "../../Modal/Modal";

interface ProductProps {
  item: any;
  onClose: () => void;
  isCollectible?: boolean;
}

const Product: FC<ProductProps> = ({ item, onClose, isCollectible }) => {
  const { user } = useTelegram();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  // для отрисовки интерфейса продажи айтема
  const isUserSeller = Number(userId) === Number(item?.seller_id);
  // хендлер покупки
  const handleBuyItem = async (item: ItemData) => {
    try {
      const res: any = await buyItemRequest(item.item_id, 1, userId);
      setMessageShown(true);
      switch (res.message) {
        case "out":
          setMessage("Товара нет в наличии");
          break;
        case "money":
          setMessage("Недостаточно средств");
          break;
        case "ok":
          setMessage("Успешная покупка");
          dispatch(setCollectibles(item.item_id));
          dispatch(setCoinsValueAfterBuy(item.item_price_coins));
          dispatch(setTokensValueAfterBuy(item.item_price_tokens));
          setActiveSkinRequest(item.item_id, userId);
          dispatch(setActiveSkin(item.item_id));
          break;
        default:
          break;
      }
      setTimeout(async () => {
        onClose();
        setTimeout(() => {
          setMessage('');
          setMessageShown(false);
        }, 200)
      }, 1000)
    } catch (error) {
      console.log(error);
    }
  };
  // хендлер установки скина в актив
  const handleSetActiveSkin = async (itemId: number) => {
    setActiveSkinRequest(itemId, userId);
    dispatch(setActiveSkin(itemId));
    onClose();
  };
  // продажа товара в лавку
  const handleSellToLavka = async (itemId: number, price: number = 5) => {
    setModalOpen(true);
    // const res: any = await sellLavkaRequest(itemId, price, userId);
    // setMessageShown(true);
    // switch (res.message) {
    //   case "already":
    //     setMessage("Товар уже на витрине");
    //     break;
    //   case "ok":
    //     setMessage("Размещено в лавке");
    //     dispatch(addItemToLavka(item));
    //     break;
    //   default:
    //     break;
    // }
    // dispatch(removeCollectible(itemId));
    // setTimeout(async () => {
    //   onClose();
    //   setTimeout(() => {
    //     setMessage('');
    //     setMessageShown(false);
    //   }, 200)
    // }, 1000)
  };
  // хендлер снятия товара с продажи
  const handleCancelSelling = (itemId: number) => {
    // cancelLavkaRequest(itemId, userId);
    setMessageShown(true);
    setMessage("Товар снят с продажи");
    dispatch(removeItemFromLavka(itemId));
    setTimeout(async () => {
      onClose();
      setTimeout(() => {
        setMessage('');
        setMessageShown(false);
      }, 200)
    }, 1000)
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
                    handleClick={() => handleSetActiveSkin(item?.item_id)} />
                </div>
                <div className={styles.product__buttonWrapper}>
                  <Button
                    text="Продать"
                    handleClick={() => handleSellToLavka(item?.item_id)}
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
                <Button text={`💵 ${item?.item_price_coins}`} handleClick={() => handleBuyItem(item)} isWhiteBackground />
              </div>
            )}
          </div>
        </>
      )}
      {isModalOpen && (
        <Modal title="Выставить в лавку" closeModal={() => setModalOpen(false)}>
          <div>
            Будем продавать или что?
          </div>
        </Modal>

      )}
    </div>
  );
};

export default Product;

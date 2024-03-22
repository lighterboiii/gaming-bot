/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './Product.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import Button from "../../ui/Button/Button";
import { useAppDispatch } from "../../../services/reduxHooks";
import { ItemData, LavkaData } from "../../../utils/types";
import { removeItemFromLavka, setActiveSkin, setCoinsValueAfterBuy, setCollectibles, setTokensValueAfterBuy } from "../../../services/appSlice";
import useTelegram from "../../../hooks/useTelegram";
import { buyItemRequest, buyLavkaRequest, cancelLavkaRequest, setActiveSkinRequest } from "../../../api/shopApi";
import { userId } from "../../../api/requestData";
import { Modal } from "../../Modal/Modal";
import SellForm from "../SellForm/SellForm";

interface ProductProps {
  item: any;
  onClose: () => void;
  isCollectible?: boolean;
  activeButton?: string;
}

const Product: FC<ProductProps> = ({ item, onClose, isCollectible, activeButton }) => {
  const { user } = useTelegram();
  // const userId = user?.id;
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  // для отрисовки интерфейса продажи айтема
  const isUserSeller = Number(userId) === Number(item?.seller_id);
  // хендлер покупки
  const handleBuyItem = async (item: ItemData) => {
    try {
      // const res: any = await buyItemRequest(item.item_id, 1, user?.id);
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
          // setActiveSkinRequest(item.item_id, user?.id);
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
    // setActiveSkinRequest(itemId, user?.id);
    try {
      setActiveSkinRequest(itemId, userId);
      dispatch(setActiveSkin(itemId));
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  // хендлер снятия товара с продажи
  const handleCancelSelling = async (itemId: number) => {
    // cancelLavkaRequest(itemId, user?.id); 
    try {
      const res = await cancelLavkaRequest(itemId, userId);
      console.log(res);
      setMessageShown(true);
      setMessage("Товар снят с продажи");
      dispatch(removeItemFromLavka(itemId));
    } catch (error) {
      console.log(error);
    }
    setTimeout(async () => {
      onClose();
      setTimeout(() => {
        setMessage('');
        setMessageShown(false);
      }, 200)
    }, 1000)
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

  const handleBuyLavkaitem = async (item: LavkaData) => {
    try {
      const res: any = await buyLavkaRequest(item, userId);
      console.log(res);
      setMessageShown(true);
      switch (res.message) {
        case "sold":
          setMessage("Уже продано!");
          break;
        case "money":
          setMessage("Недостаточно средств");
          break;
        case "break":
          setMessage("У вас уже есть этот товар");
          break;
        case "ok":
          setMessage("Куплено из лавки!");
          dispatch(setCollectibles(item.item_id));
          // dispatch(setCoinsValueAfterBuy(item.item_price_coins));
          dispatch(setTokensValueAfterBuy(item.item_price_tokens));
          // setActiveSkinRequest(item.item_id, user?.id);
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
                  <Button text={`💵 ${item?.item_price_coins}`} handleClick={() => handleBuyLavkaitem(item)} isWhiteBackground />
                ) : (
                  <Button text={`💵 ${item?.item_price_coins}`} handleClick={() => handleBuyItem(item)} isWhiteBackground />
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

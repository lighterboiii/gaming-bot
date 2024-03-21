/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './Product.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import Button from "../../ui/Button/Button";
import { putReq } from "../../../api/api";
import { activeSkinValue, buyShopItemUri, setActiveSkinUri, userId } from "../../../api/requestData";
import { useAppDispatch } from "../../../services/reduxHooks";
import { ItemData } from "../../../utils/types";
import { addItemToLavka, setActiveSkin, setCoinsValueAfterBuy, setCollectibles, setLavkaAvailable, setTokensValueAfterBuy } from "../../../services/userSlice";
import useTelegram from "../../../hooks/useTelegram";

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

  const setActiveSkinRequest = async (itemId: number) => {
    return await putReq({
      uri: setActiveSkinUri,
      // userId: userId,
      userId: user?.id, 
      endpoint: `${activeSkinValue}${itemId}`
    });
  };
  const buyItemRequest = async (itemId: number, itemCount: number = 1) => {
    return await putReq({
      uri: buyShopItemUri,
      // userId: userId,
      userId: user?.id,
      endpoint: `&item_id=${itemId}&count=${itemCount}`
    });
  };
  const sellLavkaRequest = async (itemId: number) => {
    return await putReq({
      uri: 'add_sell_lavka?user_id=',
      // userId: userId,
      userId: user?.id,
      endpoint: `&item_id=${itemId}&price=20`,
    });
  }

  const handleBuyItem = async (item: ItemData) => {
    try {
      const res: any = await buyItemRequest(item.item_id, 1);
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
          setActiveSkinRequest(item.item_id);
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

  const handleSetActiveSkin = async (itemId: number) => {
    setActiveSkinRequest(itemId);
    dispatch(setActiveSkin(itemId));
    onClose();
  };

  const handleSellProduct = async (itemId: number) => {
    const res: any = await sellLavkaRequest(itemId);
    console.log(res);
    setMessageShown(true);
      switch (res.message) {
        case "already":
          setMessage("Товар уже на витрине");
          break;
        case "ok":
          setMessage("Размещено в лавке");
          dispatch(addItemToLavka(item));
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
  }
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
              {item?.seller_id && <p className={styles.product__type}>
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
                    handleClick={() => handleSellProduct(item?.item_id)}
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
    </div>
  );
};

export default Product;

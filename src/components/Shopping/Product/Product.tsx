/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './Product.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import Button from "../../ui/Button/Button";
import CrossIcon from "../../../icons/Cross/Cross";
import { putReq } from "../../../api/api";
import { activeSkinValue, buyShopItemUri, setActiveSkinUri, userId } from "../../../api/requestData";
import { useAppDispatch } from "../../../services/reduxHooks";
import { ItemData } from "../../../utils/types";
import { setActiveSkin, setCollectibles } from "../../../services/userSlice";
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

  const handleBuyItem = async (item: ItemData) => {
    try {
      // await putReq({ uri: buyShopItemUri, userId: user?.id, endpoint: `&item_id=${item.item_id}&count=${item.item_count}` });
      await putReq({ uri: buyShopItemUri, userId: userId, endpoint: `&item_id=${item.item_id}&count=${item.item_count}` });
      setMessageShown(true);
      setMessage("Успешная покупка");
      dispatch(setCollectibles(item?.item_id));
      setTimeout(async () => {
        await putReq({ uri: setActiveSkinUri, userId: userId, endpoint: `${activeSkinValue}${item.item_id}` });
        dispatch(setActiveSkin(item.item_id));
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
    // await putReq({ uri: setActiveSkinUri, userId: user?.id, endpoint: `${activeSkinValue}${itemId}` });
    const res = await putReq({ uri: setActiveSkinUri, userId: userId, endpoint: `${activeSkinValue}${itemId}` });
    // dispatch(setCollectibles(item?.item_id));
    dispatch(setActiveSkin(itemId));
    onClose();
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
            <p className={styles.product__type}>Тип: {item?.item_type}</p>
            {isCollectible ? (
              <div className={styles.product__buttons}>
                <div className={styles.product__buttonWrapper}>
                  <Button
                    text="Использовать"
                    handleClick={() => handleSetActiveSkin(item?.item_id)} />
                </div>
                <div className={styles.product__buttonWrapper}>
                  <Button text="Продать" handleClick={() => { }} isWhiteBackground />
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

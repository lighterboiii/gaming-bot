/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './Product.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import Button from "../../ui/Button/Button";
import CrossIcon from "../../../icons/Cross/Cross";
import { putReq } from "../../../api/api";
import { activeSkinValue, buyShopItemUri, setActiveSkinUri, userId } from "../../../api/requestData";
import { useAppDispatch } from "../../../services/reduxHooks";
import { ItemData } from "../../../utils/types";
import { setActiveSkin } from "../../../services/userSlice";

interface ProductProps {
  item: any;
  onClose: () => void;
  isCollectible?: boolean;
}

const Product: FC<ProductProps> = ({ item, onClose, isCollectible }) => {
  const dispatch = useAppDispatch();

  const handleBuyItem = async (item: ItemData) => {
    try {
      const newItem = await putReq({ uri: buyShopItemUri, userId: userId, endpoint: `&item_id=${item.item_id}&count=${item.item_count}` });
      console.log(newItem);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(item);
  const handleSetActiveSkin = async (itemId: number) => {
    const activeSkin = await putReq({ uri: setActiveSkinUri, userId: userId, endpoint: `${activeSkinValue}${itemId}` })
    // const activeSkin = item.item_id;
    console.log(activeSkin);
    // dispatch(setActiveSkin(activeSkin));
  };

  return (
    <div className={styles.product}>
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
                handleClick={() => handleSetActiveSkin(item?.item_id)}
              />
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
      <button
        onClick={onClose}
        className={styles.product__closeButton}
      >
        <CrossIcon width={20} height={20} />
      </button>
    </div>
  );
};

export default Product;

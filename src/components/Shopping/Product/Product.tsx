/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './Product.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import Button from "../../ui/Button/Button";
import CrossIcon from "../../../icons/Cross/Cross";
import { putReq } from "../../../api/api";
import { buyShopItemUri, userId } from "../../../api/requestData";

interface ProductProps {
  item: any;
  onClose: () => void;
  activeButton: string; // временно для вёрстки
}

const Product: FC<ProductProps> = ({ item, onClose, activeButton }) => {
  console.log(item);
  const handleBuyItem = async (item: any) => {
    try {
      const newItem = await putReq({ uri: buyShopItemUri, userId: userId, endpoint: `&item_id=${item.item_id}&count=${item.item_count}` });
      console.log(newItem);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.product}>
      <div className={styles.product__avatarContainer}>
        <UserAvatar item={item} />
      </div>
      <div className={styles.product__info}>
        <p className={styles.product__type}>Тип: {item?.item_type}</p>
        {(activeButton === 'Приобретено' && item?.isOwned === true) ? (
          <div className={styles.product__buttons}>
            <div className={styles.product__buttonWrapper}>
              <Button text="Использовать" handleClick={() => { }} />
            </div>
            <div className={styles.product__buttonWrapper}>
              <Button text="Продать" handleClick={() => { }} isWhiteBackground />
            </div>
          </div>) : (

          <div className={styles.product__buttonWrapper}>
            <Button text={`💵 ${item?.item_price_coins}`} handleClick={() => { }} isWhiteBackground />
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

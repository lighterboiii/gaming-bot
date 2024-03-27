import { FC } from "react";
import styles from './ShopItem.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import { ItemData } from "../../../utils/types/shopTypes";

interface IProps {
  item: ItemData;
  activeButton: string;
  onClick: () => void;
}

const ShopItem: FC<IProps> = ({ item, onClick, activeButton }) => {
  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.item__avatarContainer}>
        <UserAvatar item={item} />
      </div>
      {activeButton !== "Приобретено" && (
        <p className={styles.item__price}>
          {item?.item_price_coins !== 0 ? `💵 ${item?.item_price_coins}` : `🔰 ${item?.item_price_tokens}`}
        </p>
      )}
    </div>
  )
};

export default ShopItem;
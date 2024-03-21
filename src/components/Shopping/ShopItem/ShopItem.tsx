import { FC } from "react";
import styles from './ShopItem.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";

interface IProps {
  item: any;
  activeButton: string;
  onClick: () => void;
}

const ShopItem: FC<IProps> = ({ item, onClick, activeButton }) => {
  return (
    <div className={styles.item} onClick={onClick}>
      {/* <p>{item.item_count}</p> */}
      <div className={styles.item__avatarContainer}>
        <UserAvatar item={item} />
      </div>
      {activeButton !== "Приобретено" && (
        <p className={styles.item__price}>{item.item_price_coins !== 0 && `${item.item_price_coins} 💵`}</p>
      )}
    </div>
  )
};

export default ShopItem;
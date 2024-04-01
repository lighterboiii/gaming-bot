/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './ShopItem.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import { CombinedItemData, ItemData } from "../../../utils/types/shopTypes";
import { postEvent } from "@tma.js/sdk";
// достать вибрацию из комментов
interface IProps {
  item: CombinedItemData;
  activeButton: string;
  onClick: () => void;
}

const ShopItem: FC<IProps> = ({ item, onClick, activeButton }) => {
  
  const handleClick = () => {
    onClick();
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
  };

  return (
    <div className={styles.item} onClick={handleClick}>
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
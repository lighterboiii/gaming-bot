import { postEvent } from "@tma.js/sdk";
import { FC } from "react";

import { useAppSelector } from "services/reduxHooks";
import { CombinedItemData } from "Utils/types/shopTypes";

import UserAvatar from "../../User/UserAvatar/UserAvatar";

import styles from './ShopItem.module.scss';

interface IProps {
  item: CombinedItemData;
  activeButton: string;
  onClick: () => void;
}

const ShopItem: FC<IProps> = ({ item, onClick, activeButton }) => {
  const translation = useAppSelector(store => store.app.languageSettings);
  const handleClick = () => {
    onClick();
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
  };

  return (
    <div className={styles.item}
onClick={handleClick}>
      {activeButton !== `${translation?.purchased}` && item?.item_count !== -1 && activeButton !== `${translation?.marketplace}` &&
        <p className={styles.item__count}>
          {item?.item_count}/{item?.item_max}
        </p>
      }
      <div className={styles.item__avatarContainer}>
        <UserAvatar item={item} />
      </div>
      {activeButton !== `${translation?.purchased}` && (
        <p className={styles.item__price}>
          {item?.item_price_coins !== 0 ? `💵 ${item?.item_price_coins}` : `🔰 ${item?.item_price_tokens}`}
        </p>
      )}
    </div>
  )
};

export default ShopItem;

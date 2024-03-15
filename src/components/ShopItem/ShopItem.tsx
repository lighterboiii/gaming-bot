import { FC } from "react";
import styles from './ShopItem.module.scss';
import UserAvatar from "../UserAvatar/UserAvatar";

interface IProps {
  item: any;
  index: number;
}

const ShopItem: FC<IProps> = ({ item, index }) => {
  return (
    <div className={styles.item}>
      <div className={styles.item__avatarContainer}>
        <UserAvatar skin={item.skin} />
      </div>
    </div>
  )
};

export default ShopItem;
import { FC } from "react";
import styles from './ShopItem.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";

interface IProps {
  item: any;
  index: number;
  onClick: () => void;
}

const ShopItem: FC<IProps> = ({ item, index, onClick }) => {
  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.item__avatarContainer}>
        <UserAvatar skin={item.skin} />
      </div>
    </div>
  )
};

export default ShopItem;
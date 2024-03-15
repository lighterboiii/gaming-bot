import { FC } from "react";
import styles from './Product.module.scss';
import UserAvatar from "../UserAvatar/UserAvatar";
import Button from "../ui/Button/Button";
import CrossIcon from "../../icons/Cross/Cross";

interface ProductProps {
  item: any;
  onClose: () => void;
}

const Product: FC<ProductProps> = ({ item, onClose }) => {
  return (
    <div className={styles.product}>
      <div className={styles.product__avatarContainer}>
        <UserAvatar skin={item?.skin} />
      </div>
      <div className={styles.product__info}>
        <p className={styles.product__type}>Тип: {item?.skinType === 'skin' ? 'скин' : 'эмодзи'}</p>
        <div className={styles.product__buttonWrapper}>
          <Button text={`💵 ${item?.price}`} handleClick={() => { }} isWhiteBackground />
        </div>
      </div>
      <button
        onClick={onClose}
        className={styles.product__closeButton}
      >
       <CrossIcon width={20} height={20} />
      </button>
    </div>
  );
}

export default Product;

import { FC } from "react";
import styles from './Product.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import Button from "../../ui/Button/Button";
import CrossIcon from "../../../icons/Cross/Cross";

interface ProductProps {
  item: any;
  onClose: () => void;
  activeButton: string; // временно для вёрстки
}

const Product: FC<ProductProps> = ({ item, onClose, activeButton }) => {

  return (
    <div className={styles.product}>
      <div className={styles.product__avatarContainer}>
        <UserAvatar item={item?.skin} />
      </div>
      <div className={styles.product__info}>
        <p className={styles.product__type}>Тип: {item?.skinType === 'skin' ? 'скин' : 'эмодзи'}</p>
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
            <Button text={`💵 ${item?.price}`} handleClick={() => { }} isWhiteBackground />
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

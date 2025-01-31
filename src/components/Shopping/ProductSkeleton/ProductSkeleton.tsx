import { FC } from 'react';

import styles from './ProductSkeleton.module.scss';

const ProductSkeleton: FC = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeleton__avatarContainer}>
        <div className={styles.skeleton__avatar} />
      </div>
      <div className={styles.skeleton__price} />
      <div className={styles.skeleton__count} />
    </div>
  );
};

export default ProductSkeleton; 
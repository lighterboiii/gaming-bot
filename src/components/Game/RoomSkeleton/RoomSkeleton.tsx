import { FC } from 'react';

import styles from './RoomSkeleton.module.scss';

const RoomSkeleton: FC = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeleton__game}>
      </div>
      <div className={styles.skeleton__creator}></div>
      <div className={styles.skeleton__number}></div>
      <div className={`${styles.skeleton__number} ${styles.skeleton__bet}`}></div>
    </div>
  );
};

export default RoomSkeleton; 
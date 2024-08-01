import { FC } from "react"

import styles from './Warning.module.scss';

export const Warning: FC = () => {
  return (
    <div className={styles.warning}>
      <p className={styles.warning__text}>
        Please rotate your device to portrait mode for optimal game performance.
      </p>
    </div>
  )
};
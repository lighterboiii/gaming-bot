import { FC } from "react";

import logoAnimated from 'Images/loader.png';

import styles from './Loader.module.scss';

const Loader: FC = () => {
  return (
    <div className={styles.loader}>
      <img src={logoAnimated}
        alt="loading" />
    </div>
  )
};

export default Loader;
import { FC } from "react";
import styles from './Loader.module.scss';
import logoAnimated from '../../images/loader.png';

const Loader: FC = () => {
  return (
    <div className={styles.loader}>
      <img src={logoAnimated} alt="loading" />
      <p className={styles.loader__text}>Загрузка...</p>
    </div>
  )
};

export default Loader;
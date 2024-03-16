import { FC } from "react";
import styles from './Loader.module.scss';

const Loader: FC = () => {
  return (
    <div className={styles.loader}>Загрузка...</div>
  )
};

export default Loader;
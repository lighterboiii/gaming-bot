import { FC } from "react";
import styles from './Header.module.scss';

const Header: FC = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.header__title}>GOWIN</h1>
    </div>
  )
}

export default Header;
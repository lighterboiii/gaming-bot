import { FC } from "react";

import gowinLogo from "../../images/gowin.png";
import warningGirl from "../../images/warning/gw_girl.png";

import styles from "./ServerErrorHandler.module.scss";

interface IProps {
  message: string;
}

export const ServerErrorHandler: FC<IProps> = ({ message }) => {
  return (
    <div className={styles.warning}>
      <img src={gowinLogo} alt="GoWin" className={styles.warning__logo} />
      <p className={styles.warning__text}>{message}</p>
      <img
        src={warningGirl}
        alt="Warning illustration"
        className={styles.warning__girl}
      />
    </div>
  );
};

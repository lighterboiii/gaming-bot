import { FC } from "react"

import { useAppSelector } from "../../services/reduxHooks";

import styles from './Warning.module.scss';

export const Warning: FC = () => {
  const translation = useAppSelector(store => store.app.languageSettings);
  
  return (
    <div className={styles.warning}>
      <p className={styles.warning__text}>
        {translation?.rotate_device}
      </p>
    </div>
  )
};
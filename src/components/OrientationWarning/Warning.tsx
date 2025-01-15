import { FC, useEffect } from "react"

import { useAppSelector } from "../../services/reduxHooks";
import { triggerHapticFeedback } from "../../utils/hapticConfig";

import styles from './Warning.module.scss';

export const Warning: FC = () => {
  const translation = useAppSelector(store => store.app.languageSettings);

  useEffect(() => {
    triggerHapticFeedback('notification', 'error');
  }, []);
  
  return (
    <div className={styles.warning}>
      <p className={styles.warning__text}>
        {translation?.rotate_device}
      </p>
    </div>
  )
};
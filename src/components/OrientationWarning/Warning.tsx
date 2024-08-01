import { postEvent } from "@tma.js/sdk";
import { FC, useEffect } from "react"

import { useAppSelector } from "../../services/reduxHooks";

import styles from './Warning.module.scss';

export const Warning: FC = () => {
  const translation = useAppSelector(store => store.app.languageSettings);

  useEffect(() => {
    postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error' });
  }, []);
  
  return (
    <div className={styles.warning}>
      <p className={styles.warning__text}>
        {translation?.rotate_device}
      </p>
    </div>
  )
};
import { FC, useEffect } from "react"

import gowinLogo from '../../images/gowin.png';
import warningGirl from '../../images/warning/gw_girl.png';
import warningQr from '../../images/warning/gw_qr.png';
import { useAppSelector } from "../../services/reduxHooks";
import { triggerHapticFeedback } from "../../utils/hapticConfig";

import styles from './Warning.module.scss';

interface IProps {
  type: 'mobile' | 'orientation';
}

export const Warning: FC<IProps> = ({ type }) => {
  const translation = useAppSelector(store => store.app.languageSettings);

  useEffect(() => {
    triggerHapticFeedback('notification', 'error');
  }, []);
  
  if (type === 'orientation') {
    return (
        <div className={styles.warningOrientation}>
        <p className={styles.warningOrientation__text}>
          {translation?.rotate_device}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.warning}>
      <div className={styles.warning__desktop}>
        <div className={styles.warning__content}>
          <img src={gowinLogo} alt="GoWin" className={styles.warning__logo} />
          <img src={warningQr} alt="QR code" className={styles.warning__qr} />
        </div>
        <img src={warningGirl} alt="Warning illustration" className={styles.warning__girl} />
        <p className={styles.warning__text}>
          {translation?.play_from_mobile_device || 'Играйте с мобильного устройства'}
        </p>
      </div>
    </div>
  );
};
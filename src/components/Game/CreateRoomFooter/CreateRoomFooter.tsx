/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../services/reduxHooks";
import { formatNumber } from '../../../utils/additionalFunctions';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';
import Button from '../../ui/Button/Button';

import styles from './CreateRoomFooter.module.scss';

const CreateRoomFooter: FC = () => {
  const navigate = useNavigate();
  const userInfo = useAppSelector(store => store.app.info);
  const translation = useAppSelector(store => store.app.languageSettings);

  const handleCreateClick = () => {
    triggerHapticFeedback('notification', 'success');
    navigate('/create-room')
  };

  return (
    <div className={styles.footer}>
      <div className={styles.footer__statistics}>
        <p className={styles.footer__stats}>💵 {userInfo && formatNumber(userInfo!.coins)}</p>
        <p className={styles.footer__stats}>🔰 {userInfo && formatNumber(userInfo!.tokens)}</p>
        <p className={styles.footer__stats}>⚡ {userInfo?.user_energy}</p>
      </div>
      <div className={styles.footer__buttonWrapper}>
        <Button text={translation?.create_room}
          handleClick={handleCreateClick} />
      </div>
    </div>
  )
};

export default CreateRoomFooter;

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../services/reduxHooks";
import { formatNumber } from '../../../utils/additionalFunctions'
import Button from '../../ui/Button/Button'

import styles from './CreateRoomFooter.module.scss';

const CreateRoomFooter: FC = () => {
  const navigate = useNavigate();
  const userInfo = useAppSelector(store => store.app.info);
  const translation = useAppSelector(store => store.app.languageSettings);

  const handleCreateClick = () => {
    // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success', });
    navigate('/create-room')
  }

  return (
    <div className={styles.footer}>
      <div className={styles.footer__statistics}>
        <p className={styles.footer__stats}>💵 {formatNumber(userInfo!.coins)}</p>
        <p className={styles.footer__stats}>🔰 {formatNumber(userInfo!.tokens)}</p>
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

import { FC } from "react";
import styles from './CreateRoomFooter.module.scss';
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../services/reduxHooks";
import { formatNumber } from "../../../utils/additionalFunctions";

const CreateRoomFooter: FC = () => {
  const navigate = useNavigate();
  const userInfo = useAppSelector(store => store.app.info);
  const translation = useAppSelector(store => store.app.languageSettings);

  return (
    <div className={styles.footer}>
      <div className={styles.footer__statistics}>
        <p className={styles.footer__stats}>💵 {formatNumber(userInfo!.coins)}</p>
        <p className={styles.footer__stats}>🔰 {formatNumber(userInfo!.tokens)}</p>
        <p className={styles.footer__stats}>⚡ {userInfo?.user_energy}</p>
      </div>
      <div className={styles.footer__buttonWrapper}>
        <Button text={translation?.create_room} handleClick={() => navigate('/create-room')} />
      </div>
    </div>
  )
};

export default CreateRoomFooter;
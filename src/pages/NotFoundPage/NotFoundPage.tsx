/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";
import styles from './NotFoundPage.module.scss';
import SmallButton from "../../components/ui/SmallButton/SmallButton";
import useTelegram from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";

const NotFoundPage: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  
  useEffect(() => {
      tg.BackButton.show().onClick(() => {
        navigate(-1);
      });
      return () => {
        tg.BackButton.hide();
      }
  }, []);
  
  return (
    <div className={styles.rooms}>
      <div className={styles.rooms__content}>
        <SmallButton to='/' text="Давай обратно" secondaryText="Контент в разработке" isWhiteBackground chevronPosition="left" />
      </div>
    </div>
  )
}

export default NotFoundPage;
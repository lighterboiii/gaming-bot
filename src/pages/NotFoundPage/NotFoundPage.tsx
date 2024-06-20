/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";
import styles from './NotFoundPage.module.scss';
import SmallButton from "../../components/ui/SmallButton/SmallButton";
import useTelegram from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import { indexUrl } from "../../utils/routes";

const NotFoundPage: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  
  useEffect(() => {
      tg.BackButton.show().onClick(() => {
        navigate(indexUrl);
      });
      return () => {
        tg.BackButton.hide();
      }
  }, []);
  
  return (
    <div className={styles.rooms}>
      <div className={styles.rooms__content}>
        <SmallButton handleClick={() => navigate(-1)} text="Ошибка 404" secondaryText="Перейти на главную" isWhiteBackground chevronPosition="left" />
      </div>
    </div>
  )
}

export default NotFoundPage;
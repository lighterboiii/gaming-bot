import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SmallButton from "../../components/ui/SmallButton/SmallButton";
import useTelegram from "../../hooks/useTelegram";
import { useAppSelector } from "../../services/reduxHooks";
import { indexUrl } from "../../utils/routes";

import styles from './NotFoundPage.module.scss';

export const NotFoundPage: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const translation = useAppSelector(store => store?.app.languageSettings);
  
  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(indexUrl);
    });
    return () => {
      tg.BackButton.hide();
    }

  }, [navigate, tg.BackButton]);

  return (
    <div className={styles.rooms}>
      <div className={styles.rooms__content}>
        <SmallButton
          handleClick={() => navigate(-1)}
          text={translation?.error404}
          secondaryText="Перейти на главную"
          isWhiteBackground
          chevronPosition="left"
        />
      </div>
    </div>
  )
}


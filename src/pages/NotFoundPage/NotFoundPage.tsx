import { FC } from "react";
import { useNavigate } from "react-router-dom";

import useSetTelegramInterface from "hooks/useSetTelegramInterface";

import SmallButton from "../../components/ui/SmallButton/SmallButton";
import { useAppSelector } from "../../services/reduxHooks";
import { indexUrl } from "../../utils/routes";

import styles from './NotFoundPage.module.scss';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const translation = useAppSelector(store => store?.app.languageSettings);
  
useSetTelegramInterface(indexUrl);

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


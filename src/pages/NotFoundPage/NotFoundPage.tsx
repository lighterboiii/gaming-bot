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
  }, [tg, navigate]);

  return (
    <main className={styles.rooms}>
      <header className={styles.rooms__header}>
        <h1>{translation?.error404}</h1>
      </header>
      <section className={styles.rooms__content}>
        <SmallButton
          handleClick={() => navigate(indexUrl)}
          text={translation?.error404}
          secondaryText={translation?.error404_second}
          isWhiteBackground
          chevronPosition="left"
        />
      </section>
    </main>
  )
}


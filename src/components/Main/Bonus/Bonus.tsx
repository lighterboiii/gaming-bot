import { FC, useEffect } from "react";

import Button from "../..//ui/Button/Button";
import { addCoins, addTokens, clearDailyBonus } from "../../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../../services/reduxHooks";
import { triggerHapticFeedback } from "../../../utils/hapticConfig";
import { IBonus } from "../../../utils/types/mainTypes";

import styles from './Bonus.module.scss';

interface IProps {
  bonus: IBonus;
  closeOverlay: () => void;
}

const DailyBonus: FC<IProps> = ({ bonus, closeOverlay }) => {
  const dispatch = useAppDispatch();
  const translation = useAppSelector(store => store.app.languageSettings);

  useEffect(() => {
    return () => {
      dispatch(clearDailyBonus());
    };
  }, [dispatch]);

  const handleGetBonus = async () => {
    if (bonus?.bonus_type === "tokens") {
      const formattedTokens = Math.floor(Number(bonus?.bonus_count));
      dispatch(addTokens(formattedTokens));
    } else if (bonus?.bonus_type === "coins") {
      const formattedCoins = Math.floor(Number(bonus?.bonus_count));
      dispatch(addCoins(formattedCoins));
    }
    triggerHapticFeedback('notification', 'success');
    closeOverlay();
    dispatch(clearDailyBonus());
  };

  return (
    <div key={bonus?.bonus_item_id}
      className={styles.bonus}>
      <div className={styles.bonus__layout}>
        <div className={styles.bonus__titleContainer}>
          <h2 className={styles.bonus__title}>{translation?.daily_reward}</h2>
          <p className={styles.bonus__text}>{translation?.come_back_tomorrow}</p>
        </div>
        <div className={styles.bonus__content}>
          <img src={bonus?.bonus_image}
            alt="bonus_image"
            className={styles.bonus__image} />
          <p className={styles.bonus__text}>{bonus?.bonus_translate}</p>
          <div className={styles.bonus__button}>
            <Button
              handleClick={handleGetBonus}
              text={bonus?.bonus_count 
                ? `${translation?.claim} ${bonus.bonus_count}`
                : translation?.claim}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyBonus;

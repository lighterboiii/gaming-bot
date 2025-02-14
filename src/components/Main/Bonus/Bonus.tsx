import { FC } from "react";

import Button from "../..//ui/Button/Button";
import { clearDailyBonus, setNewTokensValue } from "../../../services/appSlice";
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
  const handleGetBonus = async (item: IBonus) => {
    switch (item?.bonus_type) {
      case "tokens":
        const formattedTokens = Math.floor(bonus?.bonus_count);
        dispatch(setNewTokensValue(formattedTokens));
        triggerHapticFeedback('notification', 'success');
        break;
      default:
        triggerHapticFeedback('notification', 'success');
        break;
    }
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              handleClick={() => handleGetBonus(bonus!)}
              text={
                `${(bonus?.bonus_type === "tokens" ||
                  bonus?.bonus_type === "exp" ||
                  bonus?.bonus_type === "energy_drink" ||
                  bonus?.bonus_type === "emoji")
                  ? `${translation?.claim} ${bonus?.bonus_count}`
                  : `${translation?.claim}`}`
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyBonus;

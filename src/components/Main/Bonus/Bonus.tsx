/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from '@tma.js/sdk';
import { FC } from "react";

import useTelegram from "hooks/useTelegram";

import Button from "../..//ui/Button/Button";
import { userId } from "../../../api/requestData";
import { makeCollectibleRequest } from "../../../api/shopApi";
import { clearDailyBonus, setCollectibles, setEnergyDrinksValue, setNewTokensValue } from "../../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../../services/reduxHooks";
import { IBonus } from "../../../utils/types/mainTypes";

import styles from './Bonus.module.scss';

interface IProps {
  bonus: IBonus;
  closeOverlay: () => void;
}

const DailyBonus: FC<IProps> = ({ bonus, closeOverlay }) => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useTelegram();
  const userId = user?.id;
  const translation = useAppSelector(store => store.app.languageSettings);
  // обработчик действия по кнопке "забрать"
  const handleGetBonus = async (item: IBonus) => {
    const itemId = Number(item?.bonus_item_id);
    const itemCount = Number(item?.bonus_count);
    switch (item?.bonus_type) {
      case "tokens":
        const tokens = await makeCollectibleRequest(itemId, itemCount, userId);
        const formattedTokens = Math.floor(tokens.message);
        dispatch(setNewTokensValue(formattedTokens));
        postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success', });
        break;
      case "energy_drink":
        const resEnergy = await makeCollectibleRequest(itemId, itemCount, userId);
        dispatch(setEnergyDrinksValue(resEnergy.message));
        postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success', });
        break;
      case "exp":
        await makeCollectibleRequest(itemId, itemCount, userId);
        postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success', });
        break;
      default:
        await makeCollectibleRequest(itemId, itemCount, userId);
        dispatch(setCollectibles(item.bonus_item_id));
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
          <p className={styles.bonus__text}>{bonus?.bonus_type}</p>
          <div className={styles.bonus__button}>
            <Button
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              handleClick={() => handleGetBonus(bonus!)}
              text={
                `${(bonus?.bonus_type === "tokens" ||
                  bonus?.bonus_type === "exp" ||
                  bonus?.bonus_type === "energy_drink")
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

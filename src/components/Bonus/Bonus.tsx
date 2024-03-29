/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import { Bonus } from "../../utils/types/mainTypes";
import styles from './Bonus.module.scss';
import Button from "../ui/Button/Button";
import { useAppDispatch } from "../../services/reduxHooks";
import { clearDailyBonus, setCollectibles, setEnergyDrinksValue, setNewExpValue, setNewTokensValue } from "../../services/appSlice";
import { userId } from "../../api/requestData";
import useTelegram from "../../hooks/useTelegram";
import { makeCollectibleRequest } from "../../api/shopApi";
import { postEvent } from '@tma.js/sdk';

interface IProps {
  bonus: Bonus;
  closeOverlay: () => void;
}

const DailyBonus: FC<IProps> = ({ bonus, closeOverlay }) => {
  const dispatch = useAppDispatch();
  const { user } = useTelegram();
  // const userId = user?.id;
  // обработчик действия по кнопке "забрать"
  const handleGetBonus = async (item: Bonus) => {
    const itemId = Number(item?.bonus_item_id);
    const itemCount = Number(item?.bonus_count);
    switch (item?.bonus_type) {
      case "tokens":
        const tokens = await makeCollectibleRequest(itemId, itemCount, userId);
        const formattedTokens = Math.floor(tokens.message);
        dispatch(setNewTokensValue(formattedTokens));
        break;
      case "energy_drink":
        const resEnergy = await makeCollectibleRequest(itemId, itemCount, userId);
        dispatch(setEnergyDrinksValue(resEnergy.message));
        break;
      case "exp":
        const resExp = await makeCollectibleRequest(itemId, itemCount, userId);
        dispatch(setNewExpValue(resExp.message));
        break;
      default:
        // postEvent('web_app_trigger_haptic_feedback', {
        //   type: 'notification',
        //   notification_type: 'success',
        // });
        await makeCollectibleRequest(itemId, itemCount, userId);
        dispatch(setCollectibles(item.bonus_item_id));
        break;
    }
    closeOverlay();
    dispatch(clearDailyBonus());
  };

  return (
    <div key={bonus?.bonus_item_id} className={styles.bonus}>
      <div className={styles.bonus__layout}>
        <div className={styles.bonus__titleContainer}>
          <h2 className={styles.bonus__title}>Ежедневная награда</h2>
          <p className={styles.bonus__text}>Вернитесь завтра, чтобы получить ещё</p>
        </div>
        <div className={styles.bonus__content}>
          <img src={bonus?.bonus_image} alt="bonus_image" className={styles.bonus__image} />
          <p className={styles.bonus__text}>{bonus?.bonus_type}</p>
          <div className={styles.bonus__button}>
            <Button
              handleClick={() => handleGetBonus(bonus)}
              text={
                `${(bonus?.bonus_type === "tokens" || bonus?.bonus_type === "exp" || bonus?.bonus_type === "energy_drink")
                  ? `Забрать ${bonus?.bonus_count}`
                  : 'Забрать'}`
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyBonus;
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import { Bonus } from "../../../utils/types";
import styles from './Bonus.module.scss';
import Button from "../../ui/Button/Button";
import { useAppDispatch } from "../../../services/reduxHooks";
import { setCollectibles, setEnergyDrinksValue, setNewExpValue, setNewTokensValue } from "../../../services/userSlice";
import { putReq } from "../../../api/api";
import { setCollectiblesUri, userId } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";

interface IProps {
  bonus: Bonus;
  closeOverlay: () => void;
}

const DailyBonus: FC<IProps> = ({ bonus, closeOverlay }) => {
  console.log(bonus);
  const dispatch = useAppDispatch();
  const { user } = useTelegram();
  const makeCollectibleRequest = async (itemId: number, itemCount: number) => {
    return await putReq<any>({
      uri: setCollectiblesUri,
      endpoint: `&add_collectible=${itemId}&count=${itemCount}`,
      userId: userId,
    });
  };
  // обработчик действия по кнопке "забрать"
  const handleGetBonus = async (item: Bonus) => {
    const itemId = Number(item.bonus_item_id);
    const itemCount = Number(item.bonus_count);
    switch (item.bonus_type) {
      case "tokens":
        const tokens = await makeCollectibleRequest(itemId, itemCount);
        const formattedTokens = Math.floor(tokens.message);
        dispatch(setNewTokensValue(formattedTokens));
        break;
      case "energy_drink":
        const resEnergy = await makeCollectibleRequest(itemId, itemCount);
        dispatch(setEnergyDrinksValue(resEnergy.message));
        break;
        case "exp":
          const resExp = await await makeCollectibleRequest(itemId, itemCount);
          dispatch(setNewExpValue(resExp.message));
          break;
      default:
        await makeCollectibleRequest(itemId, itemCount);
        dispatch(setCollectibles(item.bonus_item_id));
        break;
    }
    closeOverlay();
  };

  return (
    <div key={bonus.bonus_item_id} className={styles.bonus}>
      <div className={styles.bonus_layout}>
        <div className={styles.bonus__titleContainer}>
          <h2 className={styles.bonus__title}>Ежедневная награда</h2>
          <p className={styles.bonus__text}>Вернитесь завтра, чтобы получить ещё</p>
        </div>
        <div className={styles.bonus__content}>
          <img src={bonus.bonus_image} alt="bonus_image" className={styles.bonus__image} />
          <p className={styles.bonus__text}>{bonus.bonus_type}</p>
          <div className={styles.bonus__button}>
            <Button
              handleClick={() => handleGetBonus(bonus)}
              text={
                `${(bonus.bonus_type === "tokens" || bonus.bonus_type === "exp" || bonus.bonus_type === "energy_drink")
                  ? `Забрать ${bonus.bonus_count}`
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
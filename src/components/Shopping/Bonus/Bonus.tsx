/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import { Bonus } from "../../../utils/types";
import styles from './Bonus.module.scss';
import Button from "../../ui/Button/Button";
import { useAppDispatch } from "../../../services/reduxHooks";
import { setCollectibles, setNewCoinsValue, setNewTokensValue } from "../../../services/userSlice";
import { putReq } from "../../../api/api";
import { newTokensValue, setCollectiblesUri, setTokensValueUri, userId } from "../../../api/requestData";

interface IProps {
  bonus: Bonus;
  closeOverlay: () => void;
}

const DailyBonus: FC<IProps> = ({ bonus, closeOverlay }) => {
  const dailyBonus = bonus.bonus;
  // console.log(dailyBonus);
  const dispatch = useAppDispatch();

  const handleGetBonus = async (item: Bonus) => {
    switch (item.bonus.bonus_type) {
      case "tokens":
        // await putReq<any>({
        //   uri: setTokensValueUri,
        //   endpoint: newTokensValue,
        //   userId: userId,
        //   // userId: user?.id
        // });
        // dispatch(setNewTokensValue(item.bonus.bonus_count));
        closeOverlay();
        break;
      case "exp":
        closeOverlay();
        // await putReq<any>({
        //   uri: '/add_exp',
        //   endpoint: "/new_exp",
        //   userId: userId,
        //   // userId: user?.id
        // });
        // dispatch(setNewCoinsValue(item.bonus.bonus_count));
        break;
      default:
        const itemId = Number(item.bonus.bonus_item_id);
        await putReq({ uri: setCollectiblesUri, endpoint: `&add_collectible=${itemId}`, userId: userId });
        dispatch(setCollectibles(item.bonus.bonus_item_id));
        break
    }
    closeOverlay();
  };

  return (
    <div key={dailyBonus.bonus_item_id} className={styles.bonus}>
      <div className={styles.bonus_layout}>
        <div className={styles.bonus__titleContainer}>
          <h2 className={styles.bonus__title}>Ежедневная награда</h2>
          <p className={styles.bonus__text}>Вернитесь завтра, чтобы получить ещё</p>
        </div>
        <div className={styles.bonus__content}>
          <img src={dailyBonus.bonus_image} alt="bonus_image" className={styles.bonus__image} />
          <p className={styles.bonus__text}>{dailyBonus.bonus_type}</p>
          <div className={styles.bonus__button}>
            <Button handleClick={() => handleGetBonus(bonus)} text="Забрать" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyBonus;
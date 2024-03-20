import { FC } from "react";
import { Bonus } from "../../../utils/types";
import styles from './Bonus.module.scss';
import Button from "../../ui/Button/Button";
import { useAppDispatch } from "../../../services/reduxHooks";
import { setCollectibles } from "../../../services/userSlice";

interface IProps {
  bonus: Bonus;
}

const DailyBonus: FC<IProps> = ({ bonus }) => {
  const dailyBonus = bonus.bonus;
  const dispatch = useAppDispatch();

  const handleGetBonus = (item: any) => {
    const bonusId = item.bonus_item_id;
    console.log(bonusId);
    dispatch(setCollectibles(bonusId));
  };

  return (
    <div key={dailyBonus.bonus_item_id} className={styles.bonus}>
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
  )
}

export default DailyBonus;
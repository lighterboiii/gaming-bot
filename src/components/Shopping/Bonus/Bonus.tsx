import { FC } from "react";
import { Bonus } from "../../../utils/types";
import styles from './Bonus.module.scss';
import Button from "../../ui/Button/Button";

interface IProps {
  bonus: Bonus;
}

const DailyBonus: FC<IProps> = ({ bonus }) => {
  const dailyBonus = bonus.bonus;
  return (
    <div key={dailyBonus.bonus_item_id} className={styles.bonus}>
      <div>
        <h2 className={styles.bonus__title}>Ежедневная награда</h2>
        <p className={styles.bonus__text}>Вернитесь завтра, чтобы получить ещё</p>
      </div>
      <div>
        <img src={dailyBonus.bonus_image} alt="bonus_image" />
        <p>{dailyBonus.bonus_type}</p>
        <div className={styles.bonus__button}>
          <Button handleClick={() => { }} text="Забрать" />
        </div>
      </div>
    </div>
  )
}

export default DailyBonus;
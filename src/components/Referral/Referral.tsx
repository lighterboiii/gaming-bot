/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './Referral.module.scss';
import Button from "../ui/Button/Button";
import { referrals } from "../../utils/mockData";
import Leader from "../User/UserContainer/UserContainer";

const Referral: FC = () => {
  return (
    <div className={styles.referral}>
      <h3 className={styles.referral__h3}>
        Приглашай друзей и получай процент с каждой игры
      </h3>
      <div className={styles.referral__buttonWrapper}>
        <Button text="Пригласить" handleClick={() => {}} />
      </div>
      <div className={styles.referral__amount}>
        <p className={styles.referral__text}>Заработано за всё время:
          <span className={styles.referral__sumSpan}>
            + 💵 312$
          </span>
        </p>
      </div>
      <div className={styles.referral__weekly}>
        <p className={styles.referral__text}>Заработано за неделю:
          <span className={styles.referral__sumSpan}>
            + 💵 16$
          </span>
        </p>
      </div>
      <div className={styles.referral__board}>
        {referrals.map((ref: any, index: number) => (
          <Leader leader={ref} index={index} length={referrals.length + 1} key={index} />
        ))}
      </div>
    </div>
  )
}

export default Referral;
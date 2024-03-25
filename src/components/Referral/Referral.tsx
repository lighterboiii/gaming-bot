/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './Referral.module.scss';
import Button from "../ui/Button/Button";
import UserContainer from "../User/UserContainer/UserContainer";
import { userId } from "../../api/requestData";
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { getReq } from "../../api/api";
import { getReferralsData } from "../../api/mainApi";

const Referral: FC = () => {
  const navigate = useNavigate();
  const { user, tg } = useTelegram();
  // const userId = user?.id;
  const [totalBalance, setTotalBalance] = useState<any>(null);
  const [refsBoard, setRefsBoard] = useState<any>(null);

  useEffect(() => {
    const fetchRefsData = async () => {
      try {
        const leaders = await getReferralsData(userId);
        setRefsBoard(leaders.result_data.refs_info);
        setTotalBalance(leaders.result_data.total_balance);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRefsData();
  }, []);
  
  return (
    <div className={styles.referral}>
      <h3 className={styles.referral__h3}>
        Приглашай друзей и получай процент с каждой игры
      </h3>
      <div className={styles.referral__buttonWrapper}>
        <Button text="Пригласить" handleClick={() => navigate('/lesf')} />
      </div>
      <div className={styles.referral__amount}>
        <p className={styles.referral__text}>Заработано за всё время:
          <span className={styles.referral__sumSpan}>
            + {totalBalance}$
          </span>
        </p>
      </div>
      <div className={styles.referral__weekly}>
        <p className={styles.referral__text}>Заработано за неделю:
          <span className={styles.referral__sumSpan}>
            + 💵 3$
          </span>
        </p>
      </div>
      <div className={styles.referral__board}>
        {refsBoard?.map((referral: any, index: number) => (
          <UserContainer member={referral} index={index} length={refsBoard.length + 1} key={index} />
        ))}
      </div>
    </div>
  )
}

export default Referral;
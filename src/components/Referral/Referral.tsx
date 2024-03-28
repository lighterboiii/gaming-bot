/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './Referral.module.scss';
import Button from "../ui/Button/Button";
import UserContainer from "../User/UserContainer/UserContainer";
import { userId } from "../../api/requestData";
import { Link, useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { getReferralsData, transferCoinsToBalanceReq } from "../../api/mainApi";
import { useAppDispatch, useAppSelector } from "../../services/reduxHooks";
import ChevronIcon from "../../icons/Chevron/ChevronIcon";
import { setCoinsNewValue } from "../../services/appSlice";
import { formatNumber } from "../../utils/additionalFunctions";
import { IReferralCoinsTransferResponse, IReferralResponse } from "../../utils/types/mainTypes";
import { postEvent } from "@tma.js/sdk";

const Referral: FC = () => {
  const navigate = useNavigate();
  const { user, tg } = useTelegram();
  // const userId = user?.id;
  const referralCoinsAmount = useAppSelector(store => store.app.info?.referrer_all_coins);

  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [refsBoard, setRefsBoard] = useState<any>(null); // типизировать
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const refs: IReferralResponse = await getReferralsData(userId) as IReferralResponse;
        setRefsBoard(refs.result_data.refs_info);
        setTotalBalance(refs.result_data.total_balance);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleTransferCoins = async () => {
    try {
      const res: IReferralCoinsTransferResponse = await transferCoinsToBalanceReq(userId) as IReferralCoinsTransferResponse;
      setMessageShown(true);
      switch (res.transfered) {
        case "small":
          postEvent('web_app_trigger_haptic_feedback', {
            type: 'notification',
            notification_type: 'error',
          });
          setMessage("Минимальная сумма для перевода 0.1");
          break;
        default:
          postEvent('web_app_trigger_haptic_feedback', {
            type: 'notification',
            notification_type: 'success',
          });
          setMessage(`Баланс пополнен на ${formatNumber(Number(res.transfered))}`);
          dispatch(setCoinsNewValue(Number(res.new_coins)));
          setTotalBalance(0);
          break;
      }
      setTimeout(async () => {
        setRefsBoard(null);
        setTimeout(() => {
          setMessage('');
          setMessageShown(false);
        }, 200)
      }, 1000)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.referral}>
      <h3 className={styles.referral__h3}>
        Приглашай друзей и получай процент с каждой игры
      </h3>
      <Link to='https://t.me/lighterboygamebot?start=invite_link' className={styles.referral__buttonWrapper}>
        <Button text="Пригласить"  handleClick={() => {}}/>
      </Link>
      <div className={styles.referral__amount}>
        <p className={styles.referral__text}>Заработано за всё время:
          <span className={styles.referral__sumSpan}>
            + 💵 {referralCoinsAmount ? referralCoinsAmount : '0'}$
          </span>
        </p>
      </div>
      <div className={styles.referral__weekly}>
        <p className={styles.referral__text}>Заработано за неделю:
          <span className={styles.referral__sumSpan}>
            + 💵 {totalBalance ? totalBalance : '0'}$
          </span>
          <button
            disabled={totalBalance === 0}
            className={styles.referral__chevron}
            onClick={handleTransferCoins}
          >
            <ChevronIcon position="up" />
          </button>
        </p>
      </div>
      {messageShown ? (
        <div className={styles.referral__notification}>
          {message}
        </div>
      ) : (
        <div className={styles.referral__board}>
          {refsBoard !== null && refsBoard !== undefined && refsBoard.length > 0 ? (
            refsBoard?.map((referral: any, index: number) => (
              <UserContainer member={referral} index={index} length={refsBoard.length + 1} key={index} />
            ))) :
            <span className={styles.referral__sumSpan}>
              ...Пока никто из друзей, которых вы пригласили, не играл
            </span>
          }
        </div>
      )}
    </div>
  )
}

export default Referral;
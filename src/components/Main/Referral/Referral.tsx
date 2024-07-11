/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getReferralsData, transferCoinsToBalanceReq } from "API/mainApi";
import { inviteLink, userId } from "API/requestData";
import Button from "Components/ui/Button/Button";
import UserContainer from "Components/User/UserContainer/UserContainer";
import useTelegram from "Hooks/useTelegram";
import { setCoinsNewValue } from "Services/appSlice";
import { useAppDispatch, useAppSelector } from "Services/reduxHooks";
import { IMember } from "Utils/types/memberTypes";

import styles from './Referral.module.scss';

const Referral: FC = () => {
  const { user, tg } = useTelegram();
  const userId = user?.id;
  const translation = useAppSelector(store => store.app.languageSettings);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [refsBoard, setRefsBoard] = useState<IMember[] | null>(null);
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = () => {
      getReferralsData(userId)
        .then((res: any) => {
          setRefsBoard(res.result_data.refs_info);
          setTotalBalance(res.result_data.total_balance);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleTransferCoins = () => {
    transferCoinsToBalanceReq(userId)
      .then((res: any) => {
        setMessageShown(true);
        switch (res.transfered) {
          case "small":
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error', });
            setMessage(`${translation?.claim_minimum}`);
            break;
          default:
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success', });
            setMessage(`${translation?.funds_transferred}`);
            dispatch(setCoinsNewValue(Number(res.new_coins)));
            setTotalBalance(0);
            break;
        }

        setTimeout(() => {
          setTimeout(() => {
            setMessage('');
            setMessageShown(false);
          }, 200);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInviteClick = () => {
    tg.close();
  }

  return (
    <div className={styles.referral}>
      <h3 className={styles.referral__h3}>
        {translation?.menu_friends}
      </h3>
      <div className={styles.referral__amount}>
        <p className={styles.referral__text}>
          <span className={styles.referral__earn}>{translation?.earned_now}</span>
          <span className={styles.referral__sumSpan}>
            💵 {totalBalance}$
          </span>
        </p>
      </div>
      <div className={styles.referral__buttonWrapper}>
        <Button
          text={translation?.claim}
          handleClick={handleTransferCoins}
          disabled={totalBalance === 0}
        />
      </div>
      <div className={styles.referral__weekly}>
        <p className={styles.referral__text}>
          {translation?.invite_friends_bonus}
        </p>
        <Link to={inviteLink}
className={styles.referral__inviteButtonWrapper}>
          <Button
            text={translation?.invite}
            handleClick={handleInviteClick}
            isWhiteBackground />
        </Link>
      </div>
      {messageShown ? (
        <div className={styles.referral__notification}>
          {message}
        </div>
      ) : (
        <div className={styles.referral__board}>
          {refsBoard !== null && refsBoard !== undefined && refsBoard.length > 0 ? (
            refsBoard?.map((referral: any, index: number) => (
              <UserContainer member={referral}
index={index}
length={refsBoard.length + 1}
key={index} />
            ))) :
            <span className={styles.referral__emptyBoard}>
              {translation?.no_friends_played}
            </span>
          }
        </div>
      )}
    </div>
  )
}

export default Referral;

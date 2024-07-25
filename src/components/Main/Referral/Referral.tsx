/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import UserContainer from "../..//User/UserContainer/UserContainer";
import { getReferralsData, transferCoinsToBalanceReq } from "../../../api/mainApi";
import { inviteLink, userId } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";
import { setCoinsNewValue } from "../../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../../services/reduxHooks";
import { IMember } from "../../../utils/types/memberTypes";
import { IResultDataResponse, ITransferCoinsToBalanceResponse } from "../../../utils/types/responseTypes";
import Button from "../../ui/Button/Button";

import styles from './Referral.module.scss';

const Referral: FC = () => {
  const { user, tg } = useTelegram();
  const dispatch = useAppDispatch();
  // const userId = user?.id;
  const translation = useAppSelector(store => store.app.languageSettings);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [refsBoard, setRefsBoard] = useState<IMember[] | null>(null);
  const [message, setMessage] = useState('');
  const [messageShown, setMessageShown] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      getReferralsData(userId)
        .then((res) => {
          const response = res as IResultDataResponse;
          setRefsBoard(response.result_data.refs_info);
          setTotalBalance(response.result_data.total_balance);
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
      .then((response) => {
        const res = response as ITransferCoinsToBalanceResponse;
        setMessageShown(true);
        switch (res.transfered) {
          case "small":
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error', });
            setMessage(`${translation?.claim_minimum}`);
            break;
          default:
            // postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success', });
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
            refsBoard?.map((referral: IMember, index: number) => (
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

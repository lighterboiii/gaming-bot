import { FC, useEffect, useRef, useState } from "react";

import { balanceLink } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";
import WalletIcon from "../../../icons/Wallet/WalletIcon";
import { useAppSelector } from "../../../services/reduxHooks";
import { formatNumber } from "../../../utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "../../../utils/constants";
import { triggerHapticFeedback } from "../../../utils/hapticConfig";
import UserAvatar from "../UserAvatar/UserAvatar";

import styles from "./SecondaryUserInfo.module.scss";

const UserInfo: FC = () => {
  const { tg } = useTelegram();
  const userData = useAppSelector((store) => store.app.info);
  const translation = useAppSelector((store) => store.app.languageSettings);
  const isChangingSkin = useAppSelector((store) => store.app.isChangingSkin);
  const [animateCoins, setAnimateCoins] = useState(false);
  const [animateTokens, setAnimateTokens] = useState(false);
  const prevCoins = useRef(userData?.coins);
  const prevTokens = useRef(userData?.tokens);

  useEffect(() => {
    if (userData?.coins !== prevCoins.current) {
      setAnimateCoins(true);
      setTimeout(() => setAnimateCoins(false), 500);
      prevCoins.current = userData?.coins;
    }
  }, [userData?.coins]);

  useEffect(() => {
    if (userData?.tokens !== prevTokens.current) {
      setAnimateTokens(true);
      setTimeout(() => setAnimateTokens(false), 500);
      prevTokens.current = userData?.tokens;
    }
  }, [userData?.tokens]);

  const handleClickBalance = () => {
    tg.openTelegramLink(balanceLink);
    triggerHapticFeedback("notification", "error");
    tg.close();
  };

  return (
    <div className={styles.user}>
      <div className={styles.user__userInfo}>
        <div
          className={`${styles.user__avatarContainer} ${
            isChangingSkin ? styles.changingSkin : ""
          }`}
        >
          <UserAvatar />
        </div>
        <div className={styles.user__textElements}>
          <p className={styles.user__name}>
            {userData && userData?.publicname}
          </p>
          <div className={styles.user__money}>
            <p className={`${styles.user__text} ${animateCoins ? styles.animate : ''}`}>
              <span>{MONEY_EMOJI}</span>
              {userData ? formatNumber(userData?.coins) : "0"}
            </p>
            <p className={`${styles.user__text} ${animateTokens ? styles.animate : ''}`}>
              {SHIELD_EMOJI} {userData ? formatNumber(userData?.tokens) : "0"}
            </p>
          </div>
          <button
            type="button"
            className={styles.user__balance}
            onClick={handleClickBalance}
          >
            <WalletIcon width={12} height={12} />
            {translation?.webapp_balance}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

import { FC, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { balanceLink, groupLink } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";
import CommunityIcon from "../../../icons/Community/CommunityIcon";
import LevelIcon from "../../../icons/Level/LevelIcon";
import WalletIcon from "../../../icons/Wallet/WalletIcon";
import { useAppSelector } from "../../../services/reduxHooks";
import { formatNumber } from "../../../utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "../../../utils/constants";
import { triggerHapticFeedback } from "../../../utils/hapticConfig";
import CircleButton from "../../ui/CircleButton/CircleButton";
import UserAvatar from "../../User/UserAvatar/UserAvatar";

import styles from "./MainUserInfo.module.scss";

interface IProps {
  toggleOverlay: () => void;
  setWheelOverlayOpen: () => void;
}

const MainUserInfo: FC<IProps> = ({ toggleOverlay, setWheelOverlayOpen }) => {
  const { tg } = useTelegram();
  const userData = useAppSelector((store) => store.app.info);
  const translation = useAppSelector((store) => store.app.languageSettings);
  const userNameRef = useRef<HTMLParagraphElement>(null);
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
    <div className={styles.userInfo}>
      <div className={styles.userInfo__content}>
        <div className={styles.userInfo__avatarContainer}>
          <UserAvatar />
        </div>
        <div className={styles.userInfo__info}>
          <div className={styles.userInfo__textElements}>
            <div className={styles.userInfo__name}>
              <LevelIcon level={userData?.user_exp} width={24} height={24} />
              <p className={styles.userInfo__userName} ref={userNameRef}>
                {userData && userData?.publicname}
              </p>
            </div>
            <p className={`${styles.userInfo__text} ${animateCoins ? styles.animate : ''}`}>
              <span>{MONEY_EMOJI}</span>
              {userData ? formatNumber(userData?.coins) : "0"}
            </p>
            <p className={`${styles.userInfo__text} ${animateTokens ? styles.animate : ''}`}>
              <span>{SHIELD_EMOJI}</span>
              {userData ? formatNumber(userData?.tokens) : "0"}
            </p>
          </div>
          <div className={styles.userInfo__buttons}>
            <button
              type="button"
              className={styles.userInfo__balance}
              onClick={handleClickBalance}
            >
              <WalletIcon width={12} height={12} />
              {translation?.webapp_balance}
            </button>
            <Link to={groupLink} className={styles.userInfo__tasksButton}>
              <CommunityIcon width={16} height={14} color="#FFF" />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.userInfo__linkContainer}>
        <button
          type="button"
          className={styles.userInfo__button}
          onClick={setWheelOverlayOpen}
        >
          <CircleButton
            shadow
            isWhiteBackground
            iconType="fortune"
            width={24}
            height={24}
            color="#d51845"
          />
        </button>
        <button
          type="button"
          className={styles.userInfo__button}
          onClick={toggleOverlay}
        >
          <CircleButton shadow isWhiteBackground iconType="tasks" />
        </button>
      </div>
    </div>
  );
};

export default MainUserInfo;

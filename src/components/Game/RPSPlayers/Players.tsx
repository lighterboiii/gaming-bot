import { motion } from "framer-motion";
import { FC, useEffect, useRef, useState } from "react";

import { formatNumber } from "utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "utils/constants";
import { IPlayer, IPlayersProps } from "utils/types/gameTypes";
import { getUserId } from "utils/userConfig";

import UserAvatar from "../../../components/User/UserAvatar/UserAvatar";
import readyIcon from "../../../images/rock-paper-scissors/user_ready_image.png";

import styles from "./Players.module.scss";

const Players: FC<IPlayersProps> = ({ data, playerEmojis }) => {
  const userId = getUserId();
  const [animateBalance, setAnimateBalance] = useState(false);
  const prevBalanceRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    data?.players?.forEach((player: IPlayer) => {
      if (Number(player.userid) === Number(userId)) {
        const currentBalance =
          data.bet_type === "1" ? player.money : player.tokens;
        const prevBalance = prevBalanceRef.current[player.userid];

        if (prevBalance !== undefined && currentBalance !== prevBalance) {
          setAnimateBalance(true);
          setTimeout(() => setAnimateBalance(false), 500);
        }

        prevBalanceRef.current[player.userid] = currentBalance;
      }
    });
  }, [data?.players, data?.bet_type, userId]);

  return (
    <div className={styles.players}>
      {data?.players?.map((player: IPlayer) => (
        <div className={styles.players__player} key={player.userid}>
          <p className={styles.players__playerName}>{player?.publicname}</p>
          <div className={styles.players__avatarWrapper}>
            <UserAvatar
              item={player}
              avatar={player?.avatar}
              key={player?.userid}
            />
          </div>
          {player?.choice === "ready" && (
            <img
              src={readyIcon}
              alt="ready icon"
              className={styles.players__readyIcon}
            />
          )}
          {Number(player?.userid) === Number(userId) &&
            player?.choice !== "ready" && (
              <div
                className={`${styles.players__balance} ${
                  animateBalance ? styles.animate : ""
                }`}
              >
                {data?.bet_type === "1" && data
                  ? `${MONEY_EMOJI} ${formatNumber(player?.money)}`
                  : `${SHIELD_EMOJI} ${formatNumber(player?.tokens)}`}
              </div>
            )}
          {playerEmojis[player.userid] &&
            playerEmojis[player.userid] !== "none" && (
              <motion.img
                src={playerEmojis[player.userid]}
                alt="player emoji"
                className={
                  Number(player?.userid) === Number(data?.players[0]?.userid)
                    ? styles.players__selectedEmojiRight
                    : styles.players__selectedEmoji
                }
                initial={{ scale: 0.1 }}
                animate={{
                  scale: [0.1, 1.5, 1],
                  transition: {
                    duration: 1,
                    times: [0, 0.5, 1],
                  },
                }}
              />
            )}
        </div>
      ))}
    </div>
  );
};

export default Players;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from "framer-motion";
import { FC } from "react";

import { formatNumber } from "utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "utils/constants";
import { IGameData, IPlayer, IPlayersProps } from "utils/types/gameTypes";
import { getUserId } from "utils/userConfig";

import UserAvatar from "../../../components/User/UserAvatar/UserAvatar";
import readyIcon from '../../../images/rock-paper-scissors/user_ready_image.png';

import styles from './Players.module.scss';

const Players: FC<IPlayersProps> = ({ data, playerEmojis }) => {
  const userId = getUserId();
  return (
    <div className={styles.players}>
      {data?.players?.map((player: IPlayer) => (
        <div
          className={styles.players__player}
          key={player.userid}
        >
          <p className={styles.players__playerName}>{player?.publicname}</p>
          <div className={styles.players__avatarWrapper}>
            <UserAvatar
              item={player}
              avatar={player?.avatar}
              key={player?.userid}
            />
          </div>
          {player?.choice === 'ready' && (
            <img
              src={readyIcon}
              alt="ready icon"
              className={styles.players__readyIcon} />
          )}
          {Number(player?.userid) === Number(userId) && player?.choice !== 'ready' && (
            <div className={styles.players__balance}>
              {data?.bet_type === "1" && data
                ? `${MONEY_EMOJI} ${formatNumber(player?.money)}`
                : `${SHIELD_EMOJI} ${formatNumber(player?.tokens)}`
              }
            </div>
          )}
          {playerEmojis[player.userid] && playerEmojis[player.userid] !== "none" && (
            <motion.img
              src={playerEmojis[player.userid]}
              alt="player emoji"
              className={Number(player?.userid) === Number(data?.players[0]?.userid)
                ? styles.players__selectedEmojiRight
                : styles.players__selectedEmoji}
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
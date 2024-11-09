/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from "framer-motion";
import { FC } from "react";

import useTelegram from "hooks/useTelegram";
import { formatNumber } from "utils/additionalFunctions";
import { IGameData, IPlayer } from "utils/types/gameTypes";

import { userId } from "../../../api/requestData";
import UserAvatar from "../../../components/User/UserAvatar/UserAvatar";
import readyIcon from '../../../images/rock-paper-scissors/user_ready_image.png';
import { useAppSelector } from "../../../services/reduxHooks";

import styles from './Players.module.scss';

interface IProps {
  data: IGameData | any;
  userData?: IGameData | any;
}

const Players: FC<IProps> = ({ data, userData }) => {
  // const { user } = useTelegram();
  // const userId = user?.id;

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
            {data?.bet_type === "1" && userData
              ? `💵 ${formatNumber(userData?.coins)}`
              : `🔰 ${formatNumber(userData?.tokens)}`
            }
          </div>
        )}
        {player?.emoji !== "none" && (
          <motion.img
            src={player.emoji}
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
            }} />
        )}
      </div>
    ))}
  </div>
  )
};

export default Players;
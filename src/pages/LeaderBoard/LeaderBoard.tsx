/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './LeaderBoard.module.scss';
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { leadersData } from "../../utils/mockData";
import Leader from "../../components/Leader/Leader";
import skin from '../../skins/11.png';

const LeaderBoard: FC = () => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const leaderUser = leadersData.find(user => user.id === 1);
  const isUserLeader = user?.id === leaderUser; // будет использоваться для отрисовки информации о лидере, если это конкретный пользователь

  return (
    <div className={styles.leaderBoard}>
      <div className={styles.leaderBoard__header}>
        <button onClick={() => navigate(-1)} className={styles.leaderBoard__chevron}>
          <CircleButton chevronPosition="left" />
        </button>
        <h2 className={styles.leaderBoard__heading}>Лидер <br></br> недели</h2>
      </div>
      <div className={styles.leaderBoard__leader}>
        <div className={styles.leaderBoard__avatarContainer}>
          <img src={skin} className={styles.leaderBoard__skin} alt="skin" />
          <img
            src={user ? `${user?.photo_url}` : "https://i.pravatar.cc"}
            alt="leader_avatar"
            className={styles.leaderBoard__leaderAvatar}
          />
          <p className={styles.leaderBoard__label}>Это вы!</p>
        </div>
        <div className={styles.leaderBoard__leaderInfo}>
          <p className={styles.leaderBoard__leaderText}>{leaderUser?.username}</p>
          <p className={styles.leaderBoard__leaderText}>
            {leaderUser?.gain}</p>
        </div>
      </div>
      <div className={styles.leaderBoard__board}>
        {leadersData.filter(leader => leader.id !== 1).map((leader: any) =>
          <Leader leader={leader} key={leader.id} />
        )
        }
      </div>
    </div>
  )

}

export default LeaderBoard;
import { FC, useState } from "react";
import styles from './LeaderBoard.module.scss';
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { leadersData } from "../../utils/mockData";
import Leader from "../../components/Leader/Leader";

const LeaderBoard: FC = () => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [me, setMe] = useState(true); // дальше заменить на логику проверки лидера и юзера по айди

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
          <img
            src={user ? `${user?.photo_url}` : "https://i.pravatar.cc"}
            alt="leader_avatar"
            className={styles.leaderBoard__leaderAvatar}
          />
          {me && <p className={styles.leaderBoard__label}>Это вы!</p>}
        </div>
        <div className={styles.leaderBoard__leaderInfo}>
          <p className={styles.leaderBoard__leaderText}>{user ? user?.first_name : 'Максим'}</p>
          <p className={styles.leaderBoard__leaderText}>+ <span className={styles.leaderBoard__jew}>💎</span> 256</p>
        </div>
      </div>
      <div className={styles.leaderBoard__board}>
        {leadersData.map((leader: any) => 
          <Leader leader={leader} key={leader.id} />
        )
        }
      </div>
    </div>
  )

}

export default LeaderBoard;
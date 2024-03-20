/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './LeaderBoard.module.scss';
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { leadersData } from "../../utils/mockData";
import UserContainer from "../../components/User/UserContainer/UserContainer";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import { getReq } from "../../api/api";
import { getLeadersUri } from "../../api/requestData";

const LeaderBoard: FC = () => {
  const { user, tg } = useTelegram();
  const navigate = useNavigate();
  const [leaderBoard, setLeaderBoard] = useState<any>(null);

  console.log(leaderBoard?.top_users);
  useEffect(() => {
    const fetchLeadersData = async () => {
      try {
        const leaders = await getReq<any>({ uri: getLeadersUri, userId: '' });
        setLeaderBoard(leaders?.top_users);
      } catch (error) {
        console.log(error);
      }
    }
    window.scrollTo(0, 0);
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    fetchLeadersData();
    return () => {
      tg.BackButton.hide();
    }
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const leaderUser = leadersData.find(user => user.id === 1);
  const isUserLeader = user?.id === leaderUser; // будет использоваться для отрисовки информации о лидере, если это конкретный пользователь

  return (
    <div className={styles.leaderBoard}>
      <div className={styles.leaderBoard__header}>
        <h2 className={styles.leaderBoard__heading}>Таблица <br /> лидеров</h2>
      </div>
      <div className={styles.leaderBoard__leader}>
        <div className={styles.leaderBoard__avatarContainer}>
          <UserAvatar />
          <p className={styles.leaderBoard__label}>Это вы!</p>
        </div>
        <div className={styles.leaderBoard__leaderInfo}>
          <p className={styles.leaderBoard__leaderText}>{user ? user?.username : 'Максим'}</p>
          <p className={styles.leaderBoard__leaderText}>
            {leaderUser?.gain}</p>
        </div>
      </div>
      <div className={styles.leaderBoard__board}>
        {leadersData.filter((leader: any) => leader.id !== 1).map((leader: any, index: number) =>
          <UserContainer leader={leader} key={leader.id} index={index} length={leadersData.length} darkBackground />
        )
        }
      </div>
    </div>
  )

}

export default LeaderBoard;
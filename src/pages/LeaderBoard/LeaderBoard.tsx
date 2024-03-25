/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './LeaderBoard.module.scss';
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import UserContainer from "../../components/User/UserContainer/UserContainer";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import { getTopUsers } from "../../api/mainApi";

const LeaderBoard: FC = () => {
  const { user, tg } = useTelegram();

  const navigate = useNavigate();
  const [leaderBoard, setLeaderBoard] = useState<any>(null);
  const [topLeader, setTopLeader] = useState<any>(null);

  console.log(topLeader);
  useEffect(() => {
    const fetchLeadersData = async () => {
      try {
        const leaders = await getTopUsers();
        console.log(leaders);
        setTopLeader(leaders?.top_users[0]);
        setLeaderBoard(leaders?.top_users.slice(1));
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
  const isUserLeader = user?.id === topLeader; // для отрисовки информации о лидере, если это конкретный пользователь

  return (
    <div className={styles.leaderBoard}>
      <div className={styles.leaderBoard__header}>
        <h2 className={styles.leaderBoard__heading}>Таблица <br /> лидеров</h2>
      </div>
      <div className={styles.leaderBoard__leader}>
        <div className={styles.leaderBoard__background}>
          <div className={styles.leaderBoard__avatarContainer}>
            {topLeader && <UserAvatar avatar={topLeader.avatar} item={topLeader} />}
            {isUserLeader && <p className={styles.leaderBoard__label}>Это вы!</p>}
            <div className={styles.leaderBoard__leaderInfo}>
              <p className={styles.leaderBoard__leaderName}>
                {topLeader ? topLeader?.public_name : 'GoWinUser'}
              </p>
              <p className={styles.leaderBoard__leaderText}>
                +💵 {topLeader?.coins}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.leaderBoard__board}>
        {leaderBoard?.filter((leader: any) => leader.id !== 1).map((leader: any, index: number) =>
          <UserContainer user={leader} key={leader.id} index={index} length={leaderBoard.length} darkBackground />
        )
        }
      </div>
    </div>
  )

}

export default LeaderBoard;
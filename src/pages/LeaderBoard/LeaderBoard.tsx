/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import styles from './LeaderBoard.module.scss';
import { useNavigate } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import UserContainer from "../../components/User/UserContainer/UserContainer";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import { getTopUsers } from "../../api/mainApi";
import Loader from "../../components/Loader/Loader";
import { IMember, IMemberDataResponse } from "../../utils/types/memberTypes";
import { useAppSelector } from "../../services/reduxHooks";
import TimerIcon from "../../icons/Timer/TimerIcon";
import Timer from "../../components/Timer/Timer";

const LeaderBoard: FC = () => {
  const { user, tg } = useTelegram();
  const translation = useAppSelector(store => store.app.languageSettings);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState<IMember[] | null>(null);
  const [topLeader, setTopLeader] = useState<IMember | null>(null);
  const isUserLeader = user?.id === topLeader;

  useEffect(() => {
    setLoading(true);
    const fetchLeadersData = () => {
      getTopUsers()
        .then((leaders: any) => {
          setTopLeader(leaders?.top_users[0]);
          setLeaderBoard(leaders?.top_users.slice(1));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    window.scrollTo(0, 0);
    tg.BackButton.show().onClick(() => {
      navigate(-1);
    });
    fetchLeadersData();
  
    return () => {
      tg.BackButton.hide();
    };
  }, []);

  return (
    <div className={styles.leaderBoard}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.leaderBoard__header}>
            <h2 className={styles.leaderBoard__heading}>
              Топ <br /> недели
            </h2>
          </div>
          <div className={styles.leaderBoard__leader}>
            <div className={styles.leaderBoard__timeWrapper}>
              <div className={styles.leaderBoard__prize}>
                <TimerIcon />
                <Timer />
              </div>
              <div className={styles.leaderBoard__prize}>
                <span>Приз:</span>
                <span>💵 25</span>
              </div>
            </div>
            <div className={styles.leaderBoard__background}>
              <div className={styles.leaderBoard__avatarContainer}>
                {topLeader && <UserAvatar avatar={topLeader.avatar} item={topLeader} />}
                {isUserLeader && <p className={styles.leaderBoard__label}>Это вы!</p>}
                <div className={styles.leaderBoard__leaderInfo}>
                  <p className={styles.leaderBoard__leaderName}>
                    {topLeader?.public_name}
                  </p>
                  <p className={styles.leaderBoard__leaderText}>
                    <span>+ 💵 </span> {topLeader?.coins}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.leaderBoard__board + " scrollable"}>
            {leaderBoard?.filter((leader: any) => leader.id !== 1).map((leader: any, index: number) =>
              <UserContainer
                member={leader}
                key={leader.id}
                index={index}
                length={leaderBoard.length + 1}
                darkBackground
              />
            )}
          </div>
        </>
      )}
    </div>
  )

}

export default LeaderBoard;
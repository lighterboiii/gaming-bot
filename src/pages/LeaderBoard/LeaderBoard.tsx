import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTopUsers } from "API/mainApi";
import Loader from "Components/Loader/Loader";
import Timer from "Components/Timer/Timer";
import UserAvatar from "Components/User/UserAvatar/UserAvatar";
import UserContainer from "Components/User/UserContainer/UserContainer";
import useTelegram from "Hooks/useTelegram";
import FriendsIcon from "Icons/Friends/FriendsIcon";
import TimerIcon from "Icons/Timer/TimerIcon";
import { useAppSelector } from "services/reduxHooks";
import { indexUrl } from "Utils/routes";
import { IMember } from "Utils/types/memberTypes";

import styles from './LeaderBoard.module.scss';

export const LeaderBoard: FC = () => {
  const { user, tg } = useTelegram();
  const translation = useAppSelector(store => store.app.languageSettings);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState<IMember[] | null>(null);
  const [topLeader, setTopLeader] = useState<IMember | null>(null);
  const [prizePhoto, setPrizePhoto] = useState<string>('');
  const [time, setTime] = useState<any>({
    days: '',
    hours: '',
    minutes: '',
  });
  const [type, setType] = useState<string>('');
  const [prizeCount, setPrizeCount] = useState<string>('');
  // const isUserLeader = user?.id === topLeader;
  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(indexUrl);
    });
    const fetchLeadersData = () => {
      setLoading(true);
      getTopUsers()
        .then((leaders: any) => {
          setTopLeader(leaders?.top_users[0]);
          setLeaderBoard(leaders?.top_users.slice(1));
          setPrizePhoto(leaders?.top_prize_photo_url);
          setType(leaders?.top_type);
          setPrizeCount(leaders?.top_prize_count);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    window.scrollTo(0, 0);

    fetchLeadersData();
    return () => {
      tg.BackButton.hide();
    };
  }, []);

  useEffect(() => {
    const fetchTime = () => {
      getTopUsers()
        .then((leaders: any) => {
          setTime({
            days: leaders?.days,
            hours: leaders?.hours,
            minutes: leaders?.minutes
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchTime();
    const intervalId = setInterval(fetchTime, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.leaderBoard}>
      {loading ? <Loader /> : (
        <>
          <div className={styles.leaderBoard__header}>
            <h2 className={styles.leaderBoard__heading}>
              {translation?.menu_weekly_top}
            </h2>
            <p className={styles.leaderBoard__type}>
              {type === 'spendtokens' && `${translation?.leaderboard_type_spendtokens}`}
              {type === 'spendcoins' && `${translation?.leaderboard_type_spendcoins}`}
              {type === 'coins' && `${translation?.leaderboard_type_coins}`}
              {type === 'tokens' && `${translation?.leaderboard_type_tokens}`}
              {type === 'friends' && `${translation?.leaderboard_type_friends}`}
            </p>
          </div>
          <div className={styles.leaderBoard__leader}>
            <div className={styles.leaderBoard__timeWrapper}>
              <div className={styles.leaderBoard__prize}>
                <span className={styles.leaderBoard__text}>{translation?.leaders_restart_in}</span>
                <TimerIcon />
                <Timer days={time?.days}
                  hours={time?.hours}
                  minutes={time?.minutes} />
              </div>
              <div className={styles.leaderBoard__prize}>
                <span>{translation?.leaders_prize}</span>
                {prizeCount !== '' && <span>{prizeCount}</span>}
                <img src={prizePhoto}
                  alt="prize"
                  className={styles.leaderBoard__prizePhoto} />
              </div>
            </div>
            {leaderBoard?.length !== 0 ? (
              <div className={styles.leaderBoard__background}>
                <div className={styles.leaderBoard__avatarContainer}>
                  {topLeader && <UserAvatar avatar={topLeader.avatar}
                    item={topLeader} />}
                  {/* {isUserLeader && <p className={styles.leaderBoard__label}>Это вы!</p>} */}
                  <div className={styles.leaderBoard__leaderInfo}>
                    <>
                      <p className={styles.leaderBoard__leaderName}>
                        {topLeader?.public_name}
                      </p>
                      <p className={styles.leaderBoard__leaderText}>
                        {type === 'spendtokens' && '- 🔰 '}
                        {type === 'spendcoins' && '- 💵 '}
                        {type === 'coins' && '+ 💵 '}
                        {type === 'tokens' && '+ 🔰 '}
                        {type === 'friends' && <FriendsIcon width={16}
                          height={16} />}
                        {topLeader?.coins}
                      </p>
                    </>
                  </div>
                </div>
              </div>
            ) : (
              <p className={styles.leaderBoard__text}
                style={{ alignSelf: 'center', marginLeft: '30px' }} >
                {translation?.leaderboard_empty}
              </p>
            )}
          </div>
          <div className={styles.leaderBoard__board + " scrollable"}>
            {leaderBoard?.filter((leader: any) => leader.id !== 1).map((leader: any, index: number) =>
              <UserContainer
                member={leader}
                key={leader.user_id}
                index={index}
                length={leaderBoard.length + 1}
                leaderBoardType={type}
                darkBackground
              />)}
          </div>
        </>
      )}
    </div>
  )
};


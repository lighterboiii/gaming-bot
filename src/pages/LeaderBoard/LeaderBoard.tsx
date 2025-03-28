/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTopUsers } from "../../api/mainApi";
import Loader from "../../components/Loader/Loader";
import Timer from "../../components/Timer/Timer";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import UserContainer from "../../components/User/UserContainer/UserContainer";
import useTelegram from "../../hooks/useTelegram";
import FriendsIcon from "../../icons/Friends/FriendsIcon";
import TimerIcon from "../../icons/Timer/TimerIcon";
import { useAppSelector } from "../../services/reduxHooks";
import { formatNumber } from "../../utils/additionalFunctions";
import { MONEY_EMOJI, SHIELD_EMOJI } from "../../utils/constants";
import { indexUrl } from "../../utils/routes";
import { ITime } from '../../utils/types/gameTypes';
import { IMember } from "../../utils/types/memberTypes";
import { ILeaderResponse, ITopUsersRes } from '../../utils/types/responseTypes';

import styles from './LeaderBoard.module.scss';

export const LeaderBoard: FC = () => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const translation = useAppSelector(store => store.app.languageSettings);
  const [loading, setLoading] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState<IMember[] | null>(null);
  const [topLeader, setTopLeader] = useState<IMember | null>(null);
  const [prizePhoto, setPrizePhoto] = useState<string>('');
  const [time, setTime] = useState<ITime>({
    days: '',
    hours: '',
    minutes: '',
  });
  const [type, setType] = useState<string>('');
  const [prizeCount, setPrizeCount] = useState<string>('');
  console.log(leaderBoard);
  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(indexUrl);
    });
    return () => {
      tg.BackButton.hide();
    }
  }, [tg, navigate]);

  useEffect(() => {
    const fetchLeadersData = () => {
      setLoading(true);
      getTopUsers()
        .then((response) => {
          const leaders = response as ITopUsersRes;
          if (leaders?.top_users.length > 0) {
            setTopLeader(leaders?.top_users[0]);
            setLeaderBoard(leaders?.top_users.length > 1 ? leaders?.top_users.slice(1) : []);
          } else {
            setTopLeader(null);
            setLeaderBoard([]);
          }
          setPrizePhoto(leaders?.top_prize_photo_url);
          setType(leaders?.top_type);
          setPrizeCount(leaders?.top_prize_count);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    window.scrollTo(0, 0);

    fetchLeadersData();
  }, []);

  useEffect(() => {
    const fetchTime = () => {
      getTopUsers()
        .then((response) => {
          const leaders = response as ITopUsersRes;
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
              <div className={styles.leaderBoard__timeWrapper}>
                <div className={styles.leaderBoard__prizeRestart}>
                  <span className={styles.leaderBoard__text}>{translation?.leaders_restart_in}</span>
                  <TimerIcon />
                  <Timer
                    days={String(time?.days)}
                    hours={String(time?.hours)}
                    minutes={String(time?.minutes)} />
                </div>
                <div className={styles.leaderBoard__prize}>
                  <span>{translation?.leaders_prize}</span>
                  {prizeCount !== '' && <span>{prizeCount}</span>}
                  <img src={prizePhoto}
                    alt="prize"
                    className={styles.leaderBoard__prizePhoto} />
                </div>
              </div>
          </div>
          <div className={styles.leaderBoard__leader}>
            {topLeader ? (
              <div className={styles.leaderBoard__background}>
                  <div className={styles.leaderBoard__avatarContainer}>
                    {topLeader &&
                      <UserAvatar
                        avatar={topLeader.avatar}
                        item={topLeader}
                      />}
                  </div>
                <div className={styles.leaderBoard__leaderInfo}>
                  <>
                    <p className={styles.leaderBoard__leaderName}>
                      {topLeader?.public_name}
                    </p>
                    <p className={styles.leaderBoard__leaderText}>
                      {type === 'spendtokens' && `- ${SHIELD_EMOJI} `}
                      {type === 'spendcoins' && `- ${MONEY_EMOJI} `}
                      {type === 'coins' && `+ ${MONEY_EMOJI} `}
                      {type === 'tokens' && `+ ${SHIELD_EMOJI} `}
                      {type === 'friends' &&
                        <FriendsIcon
                          width={16}
                          height={16}
                        />}
                      {topLeader && formatNumber(topLeader?.coins)}
                    </p>
                  </>
                </div>
              </div>
            ) : (
              <p className={styles.leaderBoard__text}
                style={{ alignSelf: 'center'}} >
                {translation?.leaderboard_empty}
              </p>
            )}
          </div>
          <div className={styles.leaderBoard__board + " scrollable"}>
            {leaderBoard && leaderBoard.length > 0 && leaderBoard.filter((leader: ILeaderResponse) =>
              leader.user_id !== 1).map((leader: ILeaderResponse, index: number) =>
                <UserContainer
                  member={leader}
                  key={leader.user_id}
                  index={index}
                  length={leaderBoard.length + 1}
                  leaderBoardType={type}
                  darkBackground
                  isLeaderBoard
                />)}
          </div>
        </>
      )}
    </div>
  )
};


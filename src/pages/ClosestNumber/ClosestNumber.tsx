/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-fallthrough */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useRef } from "react";
import styles from './ClosestNumber.module.scss';
import { getPollingRequest, leaveRoomRequest, whoIsWinRequest } from "../../api/gameApi";
import { useNavigate, useParams } from "react-router-dom";
import useTelegram from "../../hooks/useTelegram";
import { userId } from "../../api/requestData";
import UserAvatar from "../../components/User/UserAvatar/UserAvatar";
import smile from '../../images/closest-number/smile.png';
import { useAppSelector } from "../../services/reduxHooks";
import Case from '../../components/ClosestNumber/One/CaseOne';
import CaseTwo from "../../components/ClosestNumber/Three/Three";
import CaseThree from "../../components/ClosestNumber/Four/Four";
import CaseFour from "../../components/ClosestNumber/Five/Five";
import CaseSix from "../../components/ClosestNumber/Six/Six";
import CaseSeven from "../../components/ClosestNumber/Seven/Seven";
import CaseEight from "../../components/ClosestNumber/Eight/Eight";
import { users } from '../../utils/mockData';
import { getActiveEmojiPack } from "../../api/mainApi";
import CircularProgressBar from "../../components/ClosestNumber/ProgressBar/ProgressBar";
import { IRPSPlayer } from "../../utils/types/gameTypes";
import OneByOne from "../../components/ClosestNumber/Single/Single";

interface IProps {
  users: any[];
}

const RenderComponent: FC<IProps> = ({ users }) => {
  switch (users?.length) {
    case 1:
    return <OneByOne users={users} />;
    case 3:
      return <CaseTwo users={users} />;
    case 4:
      return <CaseThree users={users} />;
    case 5:
      return <CaseFour users={users} />;
    case 6:
      return <CaseSix users={users} />;
    case 7:
      return <CaseSeven users={users} />;
    case 8:
      return <CaseEight users={users} />;
    default:
      return <Case users={users} />
  }
};

const ClosestNumber: FC = () => {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const { roomId } = useParams<{ roomId: string }>();
  const userId = user?.id;
  const [data, setData] = useState<any>(null);
  const [emojis, setEmojis] = useState<any>(null);

  const [name, setName] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [inputError, setInputError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const userData = useAppSelector(store => store.app.info);
  console.log(userData);
  useEffect(() => {
    if (data?.players) {
      const filtered = data.players.filter((player: any) => Number(player.userid) !== Number(data.creator_id));
      setFilteredPlayers(filtered);
    }
  }, [data]);

  useEffect(() => {
    tg.setHeaderColor('#FEC42C');
    tg.BackButton.show().onClick(() => {
      leaveRoomRequest(userId)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        })
      navigate(-1);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tg, navigate]);
  // свернуть клавиатуру по клику за ее границами
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setShowOverlay(false);
      }
    };

    if (showOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOverlay]);
  // long polling
  useEffect(() => {
    let isMounted = true;

    const fetchRoomInfo = async () => {
      if (!roomId || !isMounted) {
        return;
      }
      const data = {
        user_id: userId,
        room_id: roomId,
        type: 'wait'
      };
      getPollingRequest(userId, data)
        .then((res: any) => {
          console.log(res);
          setData(res);
          if (res?.message === 'None') {
            leaveRoomRequest(userId);
            isMounted = false;
            navigate(-1);
          }

          if (res?.message === 'timeout') {
            fetchRoomInfo();
          }

          if (isMounted) {
            fetchRoomInfo();
          }
        })
        .catch((error) => {
          console.error('Room data request error', error);
          leaveRoomRequest(userId)
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              console.log(error);
            })
        });
    };

    fetchRoomInfo();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const count = data?.players?.reduce((total: number, player: any) => {
    return total + (player?.choice !== "none" ? 1 : 0);
  }, 0);

  useEffect(() => {
    let timeoutId: any;
    const fetchData = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (data?.players?.some((player: IRPSPlayer) => player?.choice !== 'none')) {
          whoIsWinRequest(roomId!)
            .then((res: any) => {
              console.log(res);
            })
            .catch((error) => {
              console.error('Data request error:', error);
            });
        }
      }, 1500);
    };

    fetchData();
  }, [data]);
  // показать оверлей при фокусе в инпуте
  const handleInputFocus = () => {
    setShowOverlay(true);
  };
  // внести значение кнопки в инпут
  const handleKeyPress = (key: number) => {
    setInputValue((prevValue) => {
      const newValue = prevValue + key.toString();
      const numValue = parseInt(newValue, 10);
      
      if (newValue.length > 1 && newValue.startsWith('0')) {
        setInputError(true);
      } else if (numValue >= 1 && numValue <= 100) {
        setInputError(false);
      } else {
        setInputError(true);
      }

      return newValue;
    });
  };

  const handleDeleteNumber = () => {
    setInputValue((prevValue) => {
     const newValue = prevValue.slice(0, -1);
     console.log(newValue);
     const numValue = parseInt(newValue, 10);
     if (newValue.startsWith('0')) {
      setInputError(true);
    } else if (newValue === '' || (numValue >= 1 && numValue <= 100)) {
      setInputError(false);
    } else {
      setInputError(true);
    }
     return newValue;
    });
  };

  const handleSubmit = () => {
    const numValue = parseInt(inputValue, 10);
    if (numValue >= 1 && numValue <= 100) {
      console.log(`Choice: ${inputValue}`);
      handleChoice(inputValue);
      setShowOverlay(false);
      setInputValue('');
    } else {
      setInputError(true);
    }
  };

  const handleButtonClick = (key: number | string) => {
    if (typeof key === 'number') {
      handleKeyPress(key);
    } else {
      switch (key) {
        case 'Стереть':
          handleDeleteNumber();
          break;
        case 'Готово':
          handleSubmit();
          break;
        default:
          break;
      }
    }
  };
  // получить эмодзи пользователя
  useEffect(() => {
    getActiveEmojiPack(userId)
      .then((res: any) => {
        setName(res.user_emoji_pack.name);
        setEmojis(res.user_emoji_pack.user_emoji_pack);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // хендлер выбора хода
  const handleChoice = (value: string) => {
    const player = data?.players?.find((player: any) => Number(player?.userid) === Number(userId));
    if (data?.bet_type === "1") {
      if (player?.money <= data?.bet) {
        leaveRoomRequest(userId)
          .then(res => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          })
      }
    } else if (data?.bet_type === "3") {
      if (player?.tokens <= data?.bet) {
        leaveRoomRequest(userId)
          .then(res => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          })
      }
    }
    const choice = {
      user_id: userId,
      room_id: roomId,
      type: 'setchoice',
      choice: value
    };
    getPollingRequest(userId, choice)
      .then((res: any) => {
        setData(res);
        console.log(res);
      })
      .catch((error) => {
        console.error('Set choice error:', error);
      });
  };
  // хендлер отпрвки эмодзи
  const handleEmojiSelect = (emoji: string) => {
    const setEmojiData = {
      user_id: userId,
      room_id: roomId,
      type: 'setemoji',
      emoji: emoji
    }
    getPollingRequest(userId, setEmojiData)
      .then(res => {
        setData(res);
        setShowEmojiOverlay(false);
      })
      .catch((error) => {
        console.log(error);
      })
    setTimeout(() => {
      const empty = {
        user_id: userId,
        room_id: roomId,
        type: 'setemoji',
        emoji: 'none'
      }
      getPollingRequest(userId, empty)
        .then(res => {
          setData(res);
        })
        .catch((error) => {
          console.log(error);
        })
    }, 3000)
  };
// обработчик клика на иконку эмодзи
  const handleClickEmojiEbalo = () => {
    setShowOverlay(true);
    showEmojiOverlay === true ? setShowEmojiOverlay(false) : setShowEmojiOverlay(true);
  };
  return (
    <div className={styles.game}>
      <div className={styles.game__betContainer}>
        <p className={styles.game__bet}>
          Ставка
          <span className={styles.game__text}>
            {data?.bet_type === "1" ? "💵" : "🔰"}
          </span>
          {data?.bet}
        </p>
      </div>
      <div className={styles.game__centralContainer}>
        <p className={styles.game__centralText}> {`${count}/${data?.players_count}`}</p>
        <CircularProgressBar progress={0} />
        <p className={styles.game__centralTimer}>00:10</p>
      </div>
      <RenderComponent users={filteredPlayers} />
      <div ref={overlayRef} className={`${styles.overlay} ${showOverlay ? styles.expanded : ''}`}>
        <div className={styles.overlay__inputWrapper}>
          <div className={styles.overlay__avatarWrapper}>
            <UserAvatar />
            <p className={styles.overlay__name}>
              {userData && userData?.publicname}
            </p>
          </div>
          <div className={styles.overlay__inputContainer}>
            <input
              type="number"
              placeholder="Ваше число"
              className={`${styles.overlay__input} ${inputError ? styles.overlay__invalidInput : ''}`}
              value={inputValue}
              onFocus={handleInputFocus}
              readOnly
            />
            <p className={styles.overlay__inputText}>Ваше число от 1 до 100</p>
          </div>
          <button className={styles.overlay__emojiButton} onClick={handleClickEmojiEbalo}>
            <img src={smile} alt="smile_icon" className={styles.overlay__smile} />
          </button>
        </div>
        {showOverlay && (
          <div className={showEmojiOverlay ? styles.overlay__emojis : styles.overlay__keyboard}>
            {showEmojiOverlay ?
              (<>
                {emojis && emojis?.map((emoji: string, index: number) => (
                  <img
                    key={index}
                    src={emoji}
                    alt={`Emoji ${index}`}
                    className={styles.overlay__emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                  />
                ))}
              </>
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 'Стереть', 0, 'Готово'].map((key) => (
                  <button
                    disabled={key === 'Готово' && inputError}
                    key={key}
                    className={key === 'Стереть'
                      ? styles.overlay__bottomLeftButton
                      : key === 'Готово'
                        ? styles.overlay__bottomRightButton
                        : styles.overlay__key}
                    onClick={() => handleButtonClick(key)}>
                    {key}
                  </button>
                )
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosestNumber;
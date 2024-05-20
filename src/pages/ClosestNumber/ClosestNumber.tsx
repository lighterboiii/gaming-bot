/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-fallthrough */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState, useRef } from "react";
import styles from './ClosestNumber.module.scss';
import { leaveRoomRequest } from "../../api/gameApi";
import { useNavigate } from "react-router-dom";
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
import EmojiOverlay from "../../components/EmojiOverlay/EmojiOverlay";
import { getActiveEmojiPack } from "../../api/mainApi";
import CircularProgressBar from "../../components/ClosestNumber/ProgressBar/ProgressBar";

interface IProps {
  users: any[];
}

const RenderComponent: FC<IProps> = ({ users }) => {
  switch (users?.length) {
    case 1:
    // return <CaseOne users={users} />;
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
  // const userId = user?.id;
  const [emojis, setEmojis] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [showEmojiOverlay, setShowEmojiOverlay] = useState<boolean>(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  const userData = useAppSelector(store => store.app.info);
  console.log(userData);
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

  const handleInputFocus = () => {
    setShowOverlay(true);
  };

  const handleKeyPress = (key: number) => {
    setInputValue((prevValue) => prevValue + key.toString());
  };

  const handleDeleteNumber = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  const handleSubmit = () => {
    console.log(`Choice: ${inputValue}`);
    setShowOverlay(false);
    setInputValue('');
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

  return (
    <div className={styles.game}>
      <div className={styles.game__betContainer}>
        <p className={styles.game__bet}>
          Ставка
          <span className={styles.game__text}>
            🔰
          </span>
          24
        </p>
      </div>
      <div className={styles.game__centralContainer}>
        <p className={styles.game__centralText}>4/5</p>
        <CircularProgressBar progress={0} />
        <p className={styles.game__centralTimer}>00:10</p>
      </div>
      <RenderComponent users={users} />
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
              className={styles.overlay__input}
              value={inputValue}
              onFocus={handleInputFocus}
              readOnly
            />
            <p className={styles.overlay__inputText}>Ваше число от 1 до 100</p>
          </div>
          <button className={styles.overlay__emojiButton} onClick={() => setShowEmojiOverlay(!showEmojiOverlay)}>
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
                  // onClick={() => onEmojiSelect(String(index + 1))}
                  />
                ))}
              </>
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 'Стереть', 0, 'Готово'].map((key) => (
                  <button
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
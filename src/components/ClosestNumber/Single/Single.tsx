import { FC } from "react";
import styles from './Single.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";
import { IPropsForClosestNumberComponent } from "../../../utils/types/gameTypes";

const OneByOne: FC<IPropsForClosestNumberComponent> = ({ users }) => {
  return (
    <div className={styles.players}>
      {users?.map((user: any) => (
        <div className={styles.players__player}>
          {user?.emoji !== 'none' &&
            <div className={styles.players__emoji}>
              <img src={user?.emoji} alt="emoji" className={styles.players__emojiImage} />
            </div>
          }
          {user?.choice !== 'none' &&
            <div className={styles.players__choice}>
              {user?.choice}
            </div>}
          <UserAvatar item={user} avatar={user?.avatar} key={user?.userid} />
          <p className={styles.players__name}>
            {user && user?.publicname}
          </p>
        </div>
      ))}
    </div>
  )
};

export default OneByOne;
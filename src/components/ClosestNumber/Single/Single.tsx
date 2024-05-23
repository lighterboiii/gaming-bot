import { FC } from "react";
import styles from './Single.module.scss';
import UserAvatar from "../../User/UserAvatar/UserAvatar";

interface IProps {
  users: any;
}

const OneByOne: FC<IProps> = ({ users }) => {
  return (
    <div className={styles.players}>
      {users?.map((user: any) => (
        <div className={styles.players__player}>
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
import { FC } from "react";
import styles from './Six.module.scss';
import UserAvatar from "../../../components/User/UserAvatar/UserAvatar";

interface IProps {
  users: any;
}

const CaseSix: FC<IProps> = ({ users }) => {
  return (
    <div className={styles.players}>
      {users?.map((user: any) => (
        <div className={styles.players__player}>
          <UserAvatar item={user} avatar={user?.avatar} key={user?.userid} />
        </div>
      ))}
    </div>
  )
};

export default CaseSix;
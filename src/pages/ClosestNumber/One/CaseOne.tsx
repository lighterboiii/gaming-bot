import { FC } from "react";
import styles from './CaseOne.module.scss';
import UserAvatar from "../../../components/User/UserAvatar/UserAvatar";

interface IProps {
  users: any;
}

const Case: FC<IProps> = ({ users }) => {
  return (
    <div className={styles.players}>
      {users?.map((user: any) => (
        <div className={styles.players__player} style={users?.length <= 2 ? { width: '90px', height: '90px' } : {}}>
          <UserAvatar item={user} avatar={user?.avatar} key={user?.userid} />
        </div>
      ))}
    </div>
  )
};

export default Case;
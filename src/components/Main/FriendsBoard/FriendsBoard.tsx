import { FC } from "react";

import { useAppSelector } from "services/reduxHooks";

import UserContainer from "../../../components/User/UserContainer/UserContainer";
import { IMember } from "../../../utils/types/memberTypes";

import styles from './FriendsBoard.module.scss';

interface IProps {
  refsBoard: IMember[] | null
  refs?: boolean;
}

const FriendsBoard: FC<IProps> = ({ refsBoard, refs }) => {
  const translation = useAppSelector(store => store.app.languageSettings);
  return ( 
    <div className={styles.board + ' scrollable'}>
    {refsBoard !== null && refsBoard !== undefined && refsBoard.length > 0 ? (
      refsBoard?.map((referral: IMember, index: number) => (
        <UserContainer member={referral}
          index={index - 1}
          length={refsBoard.length + 1}
          key={index} />
      ))) :
      <span className={styles.board__emptyBoard}>
        {refs ? `${translation?.no_friends_played}` : ''}
      </span>}
  </div>
  )
};

export default FriendsBoard;
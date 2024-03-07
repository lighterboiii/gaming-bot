/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { getSkinAndMaskByIndex } from "../../utils/getSkinAndMask";
import styles from './UserAvatar.module.scss';
import avatar from '../../images/griffin.jpeg';
import { useAppSelector } from "../../services/reduxHooks";

const UserAvatar: FC = () => {
  const [skin, setSkin] = useState<any>(null);
  const [mask, setMask] = useState<any>(null);
  const userData = useAppSelector(store => store.user.userData);

  useEffect(() => {
    if (userData && userData.info.active_skin !== undefined) {
      const { skin: selectedSkin, mask: selectedMask } = getSkinAndMaskByIndex(userData.info.active_skin);
      setSkin(selectedSkin);
      setMask(selectedMask);
    }
  }, [userData]);

  return (
    <>
      {skin && mask && (
        <div className={styles.userAvatar}>
          <div className={styles.userAvatar__avatarBackground} style={{ backgroundImage: `url(${skin})` }}></div>
          <img
            src={avatar}
            alt="user_avatar"
            className={styles.userAvatar__userAvatar}
            style={{ maskImage: `url(${mask})` }}
          />
        </div>
      )}
    </>
  )
}

export default UserAvatar;
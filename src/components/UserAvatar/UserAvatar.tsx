/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { getRandomSkinAndMask, getSkinAndMaskByIndex } from "../../utils/getSkinAndMask";
import styles from './UserAvatar.module.scss';
import avatar from '../../images/griffin.jpeg';
import { useAppSelector } from "../../services/reduxHooks";

const UserAvatar: FC = () => {
  const [userSkin, setSkin] = useState<any>(null);
  const [userMask, setMask] = useState<any>(null);
  const { skin, mask } = getRandomSkinAndMask();
  const userData = useAppSelector(store => store.user.userData);
  console.log(userData);
  useEffect(() => {
    if (userData && userData.info.active_skin !== undefined) {
      const { skin: selectedSkin, mask: selectedMask } = getSkinAndMaskByIndex(userData.info.active_skin);
      setSkin(selectedSkin);
      setMask(selectedMask);
    }
  }, [userData]);

  return (
    <>
      <div className={styles.userAvatar}>
        <div
          className={styles.userAvatar__avatarBackground}
          style={{ backgroundImage: `url(${userData?.info ? userSkin : skin})` }}></div>
        <img
          src={avatar}
          alt="user_avatar"
          className={styles.userAvatar__userAvatar}
          style={{ maskImage: `url(${userData?.info ? userMask : mask})` }}
        />
      </div>
    </>
  )
}

export default UserAvatar;
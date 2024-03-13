/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { getSkinAndMaskByIndex } from "../../utils/getSkinAndMask";
import styles from './UserAvatar.module.scss';
import avatar from '../../images/griffin.jpeg';
import { useAppSelector } from "../../services/reduxHooks";
// import gifmask from '../../images/1_gif_mask.gif'
// import gifskin from '../../images/1_gif_skin.gif';
// import maskin from '../../images/3_mask.png';
// import maskskin from '../../images/3.png';

const UserAvatar: FC = () => {
  const [userSkin, setSkin] = useState<any>(null);
  const [userMask, setMask] = useState<any>(null);

  const userData = useAppSelector(store => store.user.userData);

  useEffect(() => {
    if (userData && userData.info.active_skin !== undefined) {
      const { skin: selectedSkin, mask: selectedMask } = getSkinAndMaskByIndex(userData.info.active_skin);
      setSkin(selectedSkin);
      setMask(selectedMask);
    } else {
      setSkin('');
      setMask('');
    }
  }, [userData]);

  return (
    <>
      <div className={styles.userAvatar}>
        <div
          className={styles.userAvatar__avatarBackground}
          style={{ backgroundImage: `url(${userData && userSkin})` }}></div>

        <img
          src={avatar}
          alt="user_avatar"
          className={styles.userAvatar__userAvatar}
          style={{ maskImage: `url(${userData && userMask})` }}
        />
      </div>
    </>
  )
}

export default UserAvatar;
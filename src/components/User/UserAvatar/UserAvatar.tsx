/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { getSkinAndMaskByIndex } from "../../../utils/getSkinAndMask";
import styles from './UserAvatar.module.scss';
import avatar from '../../../images/griffin.jpeg';
import { useAppSelector } from "../../../services/reduxHooks";
// import gifmask from '../../images/1_gif_mask.gif'
// import gifskin from '../../images/1_gif_skin.gif';
import maskin from '../../../images/3_mask.png';
import maskskin from '../../../images/3.png';
import { getReq } from "../../../api/api";
import { getUserAvatarUri, userId } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";

interface IProps {
  // если передан пропс skin, то отрисовка будет происходит именно этого скина, если нет, то скин подтягивается из userData
  skin?: any;
}

const UserAvatar: FC<IProps> = ({ skin }) => {
  const [userSkin, setSkin] = useState<any>(null);
  const [userMask, setMask] = useState<any>(null);
  const { tg, user } = useTelegram();
  const userData = useAppSelector(store => store.user.userData);
  // const [photo, setPhoto] = useState<any>(null);

  // useEffect(() => {
  //   const fetchUserAvatar = async () => {
  //     try {
  //       const userPhotoUrl = await getReq<any>({ uri: getUserAvatarUri, userId: userId });
  //       console.log(userPhotoUrl);
  //       setPhoto(userPhotoUrl);
  //     } catch (error) {
  //       console.log('Ошибка' + error)
  //     }
  //   }
  //   fetchUserAvatar();
  // }, []);

  useEffect(() => {
    if (skin !== undefined) {
      const { skin: selectedSkin, mask: selectedMask } = getSkinAndMaskByIndex(skin);
      setSkin(selectedSkin);
      setMask(selectedMask);
    } else if (userData && userData.info.active_skin !== undefined) {
      const { skin: selectedSkin, mask: selectedMask } = getSkinAndMaskByIndex(userData.info.active_skin);
      setSkin(selectedSkin);
      setMask(selectedMask);
    } else {
      setSkin(maskskin);
      setMask(maskin);
    }
  }, [userData, skin]);

  return (
    <>
      <div className={styles.userAvatar}>
        <div
          className={styles.userAvatar__avatarBackground}
          style={{ backgroundImage: `url(${userSkin})` }}></div>

        <img
          src={avatar}
          alt="user_avatar"
          className={styles.userAvatar__userAvatar}
          style={{ maskImage: `url(${userMask})` }}
        />
      </div>
    </>
  )
}

export default UserAvatar;
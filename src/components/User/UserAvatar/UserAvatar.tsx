/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { getSkinAndMaskByIndex } from "../../../utils/getSkinAndMask";
import styles from './UserAvatar.module.scss';
import avatar from '../../../images/griffin.jpeg';
import { useAppSelector } from "../../../services/reduxHooks";
import maskin from '../../../images/3_mask.png';
import maskskin from '../../../images/3.png';
import { getReq } from "../../../api/api";
import { getUserAvatarUri, userId } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";

interface IProps {
  // если передан пропс skin, то отрисовка будет происходит именно этого скина, если нет, то скин подтягивается из userData
  item?: any;
}

const UserAvatar: FC<IProps> = ({ item }) => {
  const [userSkin, setSkin] = useState<any>(null);
  const [userMask, setMask] = useState<any>(null);
  const userAvatar = useAppSelector(store => store.user.userData?.info.photo);
  const userData = useAppSelector(store => store.user.userData);
console.log(userData?.info.active_skin);

const getSkinAndMask = async (skinId: number) => {
  const skin = await getReq({ uri: `get_item_image/${skinId}`, userId: '' });
  const mask = await getReq({ uri: `get_item_image_mask/${skinId}`, userId: '' });
  return { skin, mask };
}

// useEffect(() => {
//   const fetchSkinAndMask = async () => {
//     if (item !== undefined) {
//     } else if (userData && userData.info.active_skin !== undefined) {
//       try {
//         const skinAndMask = await getSkinAndMask(userData.info.active_skin);
//         setSkin(skinAndMask.skin);
//         setMask(skinAndMask.mask);
//       } catch (error) {
//         console.error("Ошибка получения скина", error);
//       }
//     } else {
//       setSkin(11)
//       setMask(11)
//     }
//   };

//   fetchSkinAndMask();
// }, [userData, item]);
  useEffect(() => {
    if (item !== undefined) {
      setSkin(item?.item_pic);
      setMask(item?.item_mask);
    } else if (userData && userData.info.active_skin !== undefined) {
      const { skin: selectedSkin, mask: selectedMask } = getSkinAndMaskByIndex(userData.info.active_skin);
      setSkin(selectedSkin);
      setMask(selectedMask);
    } else {
      setSkin(maskskin);
      setMask(maskin);
    }
  }, [userData, item]);

  return (
    <>
      <div className={styles.userAvatar}>
        <div
          className={styles.userAvatar__avatarBackground}
          style={{ backgroundImage: `url(${userSkin})` }}></div>

        <img
          src={userAvatar ? userAvatar : avatar}
          // src={avatar}
          alt="user_avatar"
          className={styles.userAvatar__userAvatar}
          style={{ maskImage: `url(${userMask})` }}
        />
      </div>
    </>
  )
}

export default UserAvatar;
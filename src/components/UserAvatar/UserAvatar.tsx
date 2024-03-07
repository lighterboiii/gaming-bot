/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { getSkinAndMaskByIndex } from "../../utils/getSkinAndMask";
import styles from './UserAvatar.module.scss';
import avatar from '../../images/griffin.jpeg';
import useTelegram from "../../hooks/useTelegram";
import { getReq } from "../../api/api";
import { UserData } from "../../utils/types";
import { getUserInfoUri } from "../../api/requestData";

const UserAvatar: FC = () => {
  const { tg, user } = useTelegram();
  const [ userData, setUserData ] = useState<UserData | null>(null);
  const [skin, setSkin] = useState<any>(null);
  const [mask, setMask] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataResponse = await getReq<UserData>({ uri: getUserInfoUri });
        setUserData(userDataResponse);
      } catch (error) {
        console.error('Ошибка в получении данных пользователя:' + error);
      }
    };

    fetchUserData();
  }, []);

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
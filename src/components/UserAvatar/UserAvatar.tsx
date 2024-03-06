/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import { getRandomSkinAndMask } from "../../utils/getRandomSkin";
import styles from './UserAvatar.module.scss';
import avatar from '../../images/griffin.jpeg';
import useTelegram from "../../hooks/useTelegram";

const UserAvatar: FC = () => {
  const { tg, user } = useTelegram();
  const { skin, mask } = getRandomSkinAndMask();

  return (
    <>
      {skin && mask && (
        <div className={styles.userAvatar}>
          <div className={styles.userAvatar__avatarBackground} style={{ backgroundImage: `url(${skin})` }}></div>
          <img
            src={user?.photo_url ? user?.photo_url : avatar}
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

// обязательно задавать этому компоненту необходимые размеры с помощью div-контейнера при использовании в других компонентах
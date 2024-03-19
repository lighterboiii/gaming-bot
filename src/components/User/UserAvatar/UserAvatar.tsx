import { FC, useEffect, useState } from "react";
import styles from './UserAvatar.module.scss';
import avatar from '../../../images/griffin.jpeg';
import { useAppSelector } from "../../../services/reduxHooks";
import { ItemData } from "../../../utils/types";

interface IProps {
  // если передан пропс skin, то отрисовка будет происходит именно этого скина, если нет, то скин подтягивается из userData
  item?: ItemData;
}

const UserAvatar: FC<IProps> = ({ item }) => {
  const [userSkin, setSkin] = useState<string | null>(null);
  const [userMask, setMask] = useState<string | null>(null);

  const userAvatar = useAppSelector(store => store.user.userData?.info.photo);
  const userData = useAppSelector(store => store.user.userData);
  const activeSkin = useAppSelector(store => store.user.userData?.info.active_skin);

  useEffect(() => {
    if (item !== undefined) {
      setSkin(item?.item_pic);
      setMask(item?.item_mask);
    } else if (userData && activeSkin !== undefined) {
      setSkin(`https://gamebottggw.ngrok.app/get_item_image/${activeSkin}`); // костыль
      setMask(`https://gamebottggw.ngrok.app/get_item_image_mask/${activeSkin}`); // костыль
    } else {
      setSkin('');
      setMask('');
    }
  }, [userData, item, activeSkin]);

  return (
    <>
      <div className={styles.userAvatar}>
        <div
          className={styles.userAvatar__avatarBackground}
          style={{ backgroundImage: `url(${userSkin})` }}
        >
        </div>

        <img
          src={userAvatar ? userAvatar : avatar}
          alt="user_avatar"
          className={styles.userAvatar__userAvatar}
        style={{ maskImage: `url(${userMask})` }}
        />
      </div>
    </>
  )
}

export default UserAvatar;
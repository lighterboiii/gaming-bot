import { FC, useEffect, useState } from "react";
import styles from './UserAvatar.module.scss';
import avatar from '../../../images/griffin.jpeg';
import { useAppSelector } from "../../../services/reduxHooks";
import { ItemData } from "../../../utils/types";
import { getImageLink, getImageMaskLink } from "../../../api/requestData";

interface IProps {
  // если передан пропс skin, то отрисовка будет происходит именно этого скина, если нет, то скин подтягивается из userData
  item?: ItemData;
}

const UserAvatar: FC<IProps> = ({ item }) => {
  const [userSkin, setSkin] = useState<string | null>(null);
  const [userMask, setMask] = useState<string | null>(null);

  const userAvatar = useAppSelector(store => store.app.info?.photo);
  const userData = useAppSelector(store => store.app.info);
  const activeSkin = useAppSelector(store => store.app.info?.active_skin);

  useEffect(() => {
    if (item !== undefined) {
      setSkin(item?.item_pic);
      setMask(item?.item_mask);
    } else if (userData && activeSkin !== undefined) {
      setSkin(`${getImageLink}${activeSkin}`);
      setMask(`${getImageMaskLink}${activeSkin}`);
    } else {
      setSkin('');
      setMask('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSkin, userData]);

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
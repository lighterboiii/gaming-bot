import { FC, useEffect, useState } from "react";
import styles from './UserAvatar.module.scss';
import { useAppSelector } from "../../../services/reduxHooks";
import { getImageLink, getImageMaskLink } from "../../../api/requestData";
import { ItemData } from "../../../utils/types/shopTypes";
import { IMember } from "../../../utils/types/memberTypes";

interface IProps {
  item?: ItemData | IMember;
  avatar?: string;
}

const UserAvatar: FC<IProps> = ({ item, avatar }) => {
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
  }, [activeSkin, userData, item]);

  return (
    <>
      <div className={styles.userAvatar}>
        <div
          className={styles.userAvatar__avatarBackground}
          style={{ backgroundImage: `url(${userSkin})` }}
        >
        </div>

        <img
          src={avatar ?  avatar : userAvatar}
          alt="user_avatar"
          className={styles.userAvatar__userAvatar}
          style={{ maskImage: `url(${userMask})` }}
        />
      </div>
    </>
  )
}

export default UserAvatar;
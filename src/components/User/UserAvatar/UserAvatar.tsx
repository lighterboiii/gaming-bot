import { FC, useEffect, useState } from "react";

import { getImageLink, getImageMaskLink } from "../../../api/requestData";
import { useAppSelector } from "../../../services/reduxHooks";
import { getCachedShopImage, cacheShopImage } from "../../../utils/imageCache";

import styles from './UserAvatar.module.scss';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item?: any;
  avatar?: string;
}

const UserAvatar: FC<IProps> = ({ item, avatar }) => {
  const [userSkin, setSkin] = useState<string | null>(null);
  const [userMask, setMask] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowAvatar, setShouldShowAvatar] = useState(true);

  const userAvatar = useAppSelector(store => store.app.info?.photo);
  const userData = useAppSelector(store => store.app.info);
  const activeSkin = useAppSelector(store => store.app.info?.active_skin);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        if (item) {
          setShouldShowAvatar(item.item_type !== "emoji");
          
          const cachedImage = item.item_id ? getCachedShopImage(item.item_id) : null;
          
          if (cachedImage) {
            setSkin(cachedImage.pic);
            setMask(cachedImage.mask);
          } else {
            setSkin(item?.item_pic);
            setMask(item?.item_mask);
            
            if (item.item_id) {
              await cacheShopImage(item);
            }
          }
        } else if (userData && !item) {
          setShouldShowAvatar(true);
          const skinUrl = `${getImageLink}${activeSkin}`;
          const maskUrl = `${getImageMaskLink}${activeSkin}`;
          
          setSkin(skinUrl);
          setMask(maskUrl);
        } else {
          setShouldShowAvatar(true);
          setSkin('');
          setMask('');
        }
      } catch (error) {
        console.error('Error loading avatar images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [activeSkin, userData, item]);

  return (
    <div className={`${styles.userAvatar} ${isLoading ? styles.userAvatar_loading : ''}`}>
      <div
        className={styles.userAvatar__avatarBackground}
        style={{ backgroundImage: userSkin ? `url(${userSkin})` : 'none' }}
      >
      </div>
      {shouldShowAvatar && (
        <img
          src={avatar ? avatar : userAvatar}
          alt="user_avatar"
          className={styles.userAvatar__userAvatar}
          style={{ maskImage: userMask ? `url(${userMask})` : 'none' }}
        />
      )}
    </div>
  )
};

export default UserAvatar;

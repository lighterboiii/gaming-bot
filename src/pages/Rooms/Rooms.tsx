import { FC } from "react";
import styles from './Rooms.module.scss';
import SmallButton from "../../components/ui/SmallButton/SmallButton";

const Rooms: FC = () => {
  return (
    <div className={styles.rooms}>
      <div className={styles.rooms__content}>
        <SmallButton to='/' text="Давай обратно" secondaryText="Контент в разработке" isWhiteBackground chevronPosition="left" />
      </div>
    </div>
  )
}

export default Rooms;
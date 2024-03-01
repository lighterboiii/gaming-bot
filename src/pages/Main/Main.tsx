import { FC } from "react"
import styles from './Main.module.scss';
import CircleButton from "../../components/ui/CircleButton/CircleButton";
import UserInfo from "../../components/UserInformation/UserInformation";

const Main: FC = () => {
  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <UserInfo />
      </div>
      <div className={styles.main__content}>
        <button>Advertisment banner</button>
        <div className={styles.main__centralButtonsContainer}>
          <button type="button">Открытые комнаты с играми</button>
          <div className={styles.main__smallButtonsContainer}>
            <button type="button">Создать комнату</button>
            <button type="button">Список лидеров <CircleButton /></button>
          </div>
        </div>
      </div>
      <button type="button">Магазин</button>
    </div>
  )
}

export default Main;
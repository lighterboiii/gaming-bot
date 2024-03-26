import { FC } from 'react';
import styles from './GameSettings.module.scss';
import Button from '../../ui/Button/Button';

interface IProps {
  data: any;
}

const GameSettings: FC<IProps> = ({ data }) => {

  console.log(data);
  return (
    <div className={styles.game}>
      <div style={{ backgroundImage: `${data?.img}` }} className={styles.game__logo} />
      <div className={styles.game__content}>
        <h3 className={styles.game__title}>{data?.name}</h3>
        <div className={styles.game__balance}>
          <p className={styles.game__text}>Ваш баланс:</p>
          <div className={styles.game__balanceWrapper}>
            <p className={styles.game__text}>💵 2435</p>
            <p className={styles.game__text}>🔰 138</p>
          </div>
        </div>
        <div>
          <p className={styles.game__text}>Ставка в комнате:</p>
          <div className={styles.game__buttons}>
            <button className={`${styles.game__button}${styles.game__buttonLeft}`}></button>
            <button className={`${styles.game__button}${styles.game__buttonRight}`}></button>
          </div>
        </div>
        <div className={styles.game__buttonWrapper}>
          <Button text='Создать' handleClick={() => { }} />
        </div>
      </div>
    </div>
  )
};

export default GameSettings;
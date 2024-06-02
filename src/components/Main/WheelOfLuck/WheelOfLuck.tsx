/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';
import styles from './WheelOfLuck.module.scss';
import { wheelItems } from '../../../utils/mockData';

const WheelOfLuck: FC = () => {

  return (
    <div className={styles.wheel}>
      <h3 className={styles.wheel__title}>
        Колесо удачи
      </h3>
      <div className={styles.wheel__blackContainer}>
        <p className={styles.wheel__text}>
          Попытайте удачу и выиграйте эксклюзивны скины, наборы эмодзи или 💵 10000
        </p>
      </div>
      <div className={styles.wheel__background}>
        {wheelItems?.map((item: any) => (
          <div className={styles.wheel__item}>
            <img src={item.image} alt="item" className={styles.wheel__itemImg} />
            <p className={styles.wheel__itemText}>{item.text}</p>
          </div>
        ))
        }
      </div>
    </div>
  );
};

export default WheelOfLuck;
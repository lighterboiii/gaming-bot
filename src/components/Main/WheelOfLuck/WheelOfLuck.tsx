/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import styles from './WheelOfLuck.module.scss';
import { wheelItems } from '../../../utils/mockData';

const WheelOfLuck: FC = () => {
  const [visibleItems, setVisibleItems] = useState(wheelItems.slice(0, 4));
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = backgroundRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          setVisibleItems((prevItems) => [
            ...prevItems,
            ...wheelItems.slice(prevItems.length, prevItems.length + 4),
          ]);
        }
      }
    };

    if (backgroundRef.current) {
      backgroundRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (backgroundRef.current) {
        backgroundRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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
      <div className={styles.wheel__background} ref={backgroundRef}>
        {visibleItems?.map((item: any, index: number) => (
          <div key={index} className={styles.wheel__item}>
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
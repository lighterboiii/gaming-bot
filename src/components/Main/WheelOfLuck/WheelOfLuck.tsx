import { FC, useEffect, useRef, useState } from 'react';
import styles from './WheelOfLuck.module.scss';
import Button from '../../ui/Button/Button';
import wheelPointer from '../../../images/closest-number/wheelPoint.png';
import lamp from '../../../images/closest-number/lamp.png';
import light from '../../../images/closest-number/lamp2.png';

interface IProps {
  data: any;
  closeOverlay: () => void;
}

const WheelOfLuck: FC<IProps> = ({ data, closeOverlay }) => {
  const [prize, setPrize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<any>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const getRandomIndex = (length: number) => Math.floor(Math.random() * length);

  useEffect(() => {
    setLoading(true);
    const loadData = () => {
      if (data) {
        const max = data?.fortune_all_items.length - 4;
        const randomIndex = Math.floor(Math.random() * max);
        setVisibleItems(data?.fortune_all_items.slice(randomIndex, randomIndex + 4));
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const startSpin = () => {
    setSpinning(true);
    setPrize(false);
    const allItems = [...data?.fortune_all_items];
    setVisibleItems(allItems);
    const spinInterval = setInterval(() => {
      const firstItem = allItems.shift();
      allItems.push(firstItem!);
      setVisibleItems(allItems.slice(0, 4));
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const prizeItem = data?.fortune_prize_info[0];
      const randomIndex = getRandomIndex(allItems.length);
      allItems.splice(randomIndex, 1);
      allItems.splice(2, 0, prizeItem);

      setVisibleItems(allItems.slice(0, 4));
      setTimeout(() => {
        setSpinning(false);
        setPrize(true);
      }, 1000)
    }, 5000);
  };

  const claimPrize = () => {
    closeOverlay();
    setPrize(false);
  }

  useEffect(() => {
    return () => {
      setPrize(false);
    }
  }, [])

  return (
    <div className={styles.wheel}>
      {loading ?
        (<>
          <h3 className={styles.wheel__title}>
            Колесо удачи
          </h3>
          <div className={styles.wheel__blackContainer}>
            <p className={styles.wheel__text}>
              Загрузка...
            </p>
        </div> 
        </> ): (
      <>
        <h3 className={styles.wheel__title}>
          Колесо удачи
        </h3>
        <div className={styles.wheel__blackContainer}>
          <p className={styles.wheel__text}>
            Попытайте удачу и выиграйте эксклюзивные скины, наборы эмодзи или 💵 10000
          </p>
        </div>
        <div className={styles.wheel__background}>
          <div className={styles.wheel__lights}>
            <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light1}`}></img>
            <img src={light} alt='lamp' className={`${styles.wheel__light} ${styles.light2}`}></img>
            <img src={light} alt='lamp' className={`${styles.wheel__light} ${styles.light3}`}></img>
            <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light4}`}></img>
            <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light5}`}></img>
            <img src={light} alt='lamp' className={`${styles.wheel__light} ${styles.light6}`}></img>
            <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light7}`}></img>
            <img src={light} alt='lamp' className={`${styles.wheel__light} ${styles.light8}`}></img>
            <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light9}`}></img>
          </div>
          <img src={wheelPointer} alt="wheel pointer" className={styles.wheel__pointer} />
          <div ref={spinnerRef} className={`${styles.wheel__spinner} ${spinning ? styles.wheel__spin : ''}`}>
            {visibleItems?.map((item: any, index: number) => (
              <div key={index} className={`${styles.wheel__item} ${index === 2 && prize ? styles.wheel__specialItem : ''}`}>
                <img
                  src={item?.fortune_item_pic}
                  alt="item"
                  className={styles.wheel__itemImg}
                  style={item?.fortune_type !== "skin" ? { width: '16px', height: '16px' } : {}} />
                <p className={styles.wheel__itemText}>{item?.fortune_item_name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.wheel__buttonWrapper}>
          {!spinning && !prize && <Button text="Крутить" handleClick={startSpin} />}
          {prize && !spinning && <Button text="Забрать приз" handleClick={claimPrize} />}
        </div>
      </>)}
    </div>
  );
};

export default WheelOfLuck;
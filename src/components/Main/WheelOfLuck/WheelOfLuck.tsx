import { FC, useEffect, useRef, useState } from 'react';
import styles from './WheelOfLuck.module.scss';
import Button from '../../ui/Button/Button';
import wheelPointer from '../../../images/closest-number/wheelPoint.png';

interface IProps {
  data: any;
}

const WheelOfLuck: FC<IProps> = ({ data }) => {
  const [visibleItems, setVisibleItems] = useState<any>(data?.fortune_start_data);
  const [spinning, setSpinning] = useState(false);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const getRandomIndex = (length: number) => Math.floor(Math.random() * length);

  useEffect(() => {
    if (data) {
      setVisibleItems(data?.fortune_start_data);
    }
  }, [data]);

  const startSpin = () => {
    setSpinning(true);
    const allItems = [...data?.fortune_all_items];
    setVisibleItems(allItems);
    const spinInterval = setInterval(() => {
      const firstItem = allItems.shift();
      allItems.push(firstItem!);
      setVisibleItems(allItems.slice(0, 4));
    }, 100);

    setTimeout(() => {
      setSpinning(false);
      clearInterval(spinInterval);
      const prizeItem = data?.fortune_prize_info[0];
      const randomIndex = getRandomIndex(allItems.length);
      allItems.splice(randomIndex, 1);
      allItems.splice(2, 0, prizeItem);

      setVisibleItems(allItems.slice(0, 4));
      setTimeout(() => {
        setSpinning(false);
      }, 1000)
    }, 5000);
  };

  return (
    <div className={styles.wheel}>
      <h3 className={styles.wheel__title}>
        Колесо удачи
      </h3>
      <div className={styles.wheel__blackContainer}>
        <p className={styles.wheel__text}>
          Попытайте удачу и выиграйте эксклюзивные скины, наборы эмодзи или 💵 10000
        </p>
      </div>
      <div className={styles.wheel__background}>
        <img src={wheelPointer} alt="wheel pointer" className={styles.wheel__pointer} />
        <div ref={spinnerRef} className={`${styles.wheel__spinner} ${spinning ? styles.wheel__spin : ''}`}>
          {visibleItems?.map((item: any, index: number) => (
            <div key={index} className={styles.wheel__item}>
              <img
                src={item?.fortune_item_pic}
                alt="item"
                className={styles.wheel__itemImg}
                style={item?.fortune_type !== "skin" ? { width: '16px', height: '16px' } : {}}
              />
              <p className={styles.wheel__itemText}>{item?.fortune_item_name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.wheel__buttonWrapper}>
        <Button text="Крутить" handleClick={startSpin} />
      </div>
    </div>
  );
};

export default WheelOfLuck;



// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { FC, useEffect, useRef, useState } from 'react';
// import styles from './WheelOfLuck.module.scss';
// import { wheelItems } from '../../../utils/mockData';
// import Button from '../../ui/Button/Button';

// interface IProps {
//   data: any;
// }

// const WheelOfLuck: FC<IProps> = ({ data }) => {
//   const [visibleItems, setVisibleItems] = useState(wheelItems.slice(0, 4));
//   const backgroundRef = useRef<HTMLDivElement>(null);
//   console.log(data);
//   useEffect(() => {
//     setVisibleItems(data?.fortune_start_data);
//   }, [data]);

//   return (
//     <div className={styles.wheel}>
//       <h3 className={styles.wheel__title}>
//         Колесо удачи
//       </h3>
//       <div className={styles.wheel__blackContainer}>
//         <p className={styles.wheel__text}>
//           Попытайте удачу и выиграйте эксклюзивны скины, наборы эмодзи или 💵 10000
//         </p>
//       </div>
//       <div className={styles.wheel__background} ref={backgroundRef}>
//         {visibleItems?.map((item: any, index: number) => (
//           <div key={index} className={styles.wheel__item}>
//             <img src={item?.fortune_item_pic} alt="item" className={styles.wheel__itemImg} />
//             <p className={styles.wheel__itemText}>{item?.fortune_item_name}</p>
//           </div>
//         ))
//         }
//       </div>
//       <div className={styles.wheel__buttonWrapper}>
//         <Button text="Крутить" handleClick={() => { }} />
//       </div>
//     </div>
//   );
// };

// export default WheelOfLuck;
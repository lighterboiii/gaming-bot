/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from '@tma.js/sdk';
import { FC, useEffect, useRef, useState } from 'react';

import { getUserId } from 'utils/userConfig';

import { getWheelPrizeRequest, spinWheelRequest } from '../../../api/mainApi';
import lamp from '../../../images/closest-number/lamp.png';
import light from '../../../images/closest-number/lamp2.png';
import wheelPointer from '../../../images/closest-number/wheelPoint.png';
import { addTokens, setTokensValueAfterBuy } from '../../../services/appSlice';
import { useAppDispatch, useAppSelector } from '../../../services/reduxHooks';
import { IFortuneData, IFortuneItem } from '../../../utils/types/mainTypes';
import { IGetPrizeResponse, ISpinWheelResponse } from '../../../utils/types/responseTypes';
import Button from '../../ui/Button/Button';

import styles from './WheelOfLuck.module.scss';

interface IProps {
  data: IFortuneData | null;
  closeOverlay: () => void;
}

const WheelOfLuck: FC<IProps> = ({ data, closeOverlay }) => {
  const userId = getUserId();
  const dispatch = useAppDispatch();
  const translation = useAppSelector(store => store.app.languageSettings);
  const [messageShown, setMessageShown] = useState<boolean>(false);
  const [prize, setPrize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<IFortuneItem[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [prizeItem, setPrizeItem] = useState<IFortuneItem | null>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const getRandomIndex = (length: number) => Math.floor(Math.random() * length);
  console.log(data);
  useEffect(() => {
    setLoading(true);
    const loadData = () => {
      if (data) {
        if (prize && visibleItems.length > 0) {
          setLoading(false);
          return;
        }

        const max = data.fortune_all_items.length - 5;
        const randomIndex = Math.floor(Math.random() * max);
        setVisibleItems(data.fortune_all_items.slice(randomIndex, randomIndex + 5));
        setPrizeItem(data.fortune_prize_info[0] || null);
        setLoading(false);
      }
    };

    loadData();
  }, [data]);

  const startSpin = () => {
    if (!data) return;

    spinWheelRequest(userId)
      .then(res => {
        const response = res as ISpinWheelResponse;
        if (response?.message === 'ok') {
          dispatch(setTokensValueAfterBuy(100));
          setSpinning(true);
          setPrize(false);
          
          if (spinnerRef.current) {
            spinnerRef.current.classList.add('spinning');
          }

          const allItems = [...data.fortune_all_items];
          setVisibleItems(allItems);
          
          const spinInterval = setInterval(() => {
            const firstItem = allItems.shift();
            if (firstItem) {
              allItems.push(firstItem);
              setVisibleItems(allItems.slice(0, 5));
            }
          }, 100);

          setTimeout(() => {
            clearInterval(spinInterval);
            if (spinnerRef.current) {
              spinnerRef.current.classList.remove('spinning');
            }
            
            const prizeItem = data.fortune_prize_info[0] || null;
            const randomItems = [...data.fortune_all_items]
              .sort(() => Math.random() - 0.5)
              .slice(0, 4);
            
            const finalItems = [
              randomItems[0],
              randomItems[1],
              prizeItem,
              randomItems[2],
              randomItems[3]
            ];
            
            setVisibleItems(finalItems);
            
            setTimeout(() => {
              setSpinning(false);
              setPrize(true);
            }, 300);
          }, 5000);
        } else if (response?.message === 'notokens') {
          setMessageShown(true);
        }
      });
  };

  const claimPrize = () => {
    if (!prizeItem) return;

    getWheelPrizeRequest(userId, prizeItem.fortune_item_id, prizeItem.fortune_item_count)
      .then((res) => {
        const response = res as IGetPrizeResponse;
        if (response?.message === "ok") {
          if (prizeItem.fortune_type === 'tokens') {
            dispatch(addTokens(prizeItem.fortune_item_count));
          }
        }
      });

    closeOverlay();
    setMessageShown(false);
    setVisibleItems([]);
    setPrize(false);
    setSpinning(false);
    setPrizeItem(null);
    setLoading(false);
    if (spinnerRef.current) {
      spinnerRef.current.classList.remove('spinning');
      const specialItems = spinnerRef.current.getElementsByClassName(styles.wheel__specialItem);
      Array.from(specialItems).forEach(item => {
        item.classList.remove(styles.wheel__specialItem);
      });
    }
  };

  const onOverlayClose = () => {
    closeOverlay();
    setMessageShown(false);
    setSpinning(false);
    setLoading(false);
    if (spinnerRef.current) {
      spinnerRef.current.classList.remove('spinning');
    }
  };

  return (
    <div className={styles.wheel}>
      {loading ? (
        <>
          <h3 className={styles.wheel__title}>
            {translation?.fortune_wheel_menu}
          </h3>
          <div className={styles.wheel__blackContainer}>
            <p className={styles.wheel__text}>
              {translation?.loading}
            </p>
          </div>
        </>
      ) : (
        <>
          <h3 className={styles.wheel__title}>
            {translation?.fortune_wheel_menu}
          </h3>
          <div className={styles.wheel__blackContainer}>
            <p className={styles.wheel__text}>
              {translation?.fortune_wheel_menu_header}
            </p>
          </div>
          <div className={styles.wheel__background}>
            <div className={styles.wheel__lights}>
              <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light1}`} />
              <img src={light} alt='lamp' className={`${styles.wheel__light} ${styles.light2}`} />
              <img src={light} alt='lamp' className={`${styles.wheel__light} ${styles.light3}`} />
              <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light4}`} />
              <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light5}`} />
              <img src={light} alt='lamp' className={`${styles.wheel__light} ${styles.light6}`} />
              <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light7}`} />
              <img src={light} alt='lamp' className={`${styles.wheel__light} ${styles.light8}`} />
              <img src={lamp} alt='lamp' className={`${styles.wheel__light} ${styles.light9}`} />
            </div>
            <img src={wheelPointer} alt="wheel pointer" className={styles.wheel__pointer} />
            <div ref={spinnerRef} className={`${styles.wheel__spinner} ${spinning ? styles.wheel__spin : ''}`}>
              {visibleItems.map((item: IFortuneItem, index: number) => (
                <div
                  key={index}
                  className={`${styles.wheel__item} 
                ${index === 2 && prize ? styles.wheel__specialItem : ''}`}
                >
                  <img
                    src={item.fortune_item_pic}
                    alt="item"
                    className={styles.wheel__itemImg}
                    style={item.fortune_type !== "skin" ? { width: '16px', height: '16px' } : {}}
                  />
                  <p className={styles.wheel__itemText}>{item.fortune_item_name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.wheel__buttonWrapper}>
            {!spinning && !prize && !messageShown && (
              <Button text={translation?.fortune_wheel_spin_button} handleClick={startSpin} />
            )}
            {prize && !spinning && (
              <Button text={translation?.fortune_wheel_get_button} handleClick={claimPrize} />
            )}
            {!prize && !spinning && messageShown && (
              <Button text={translation?.insufficient_funds} handleClick={onOverlayClose} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WheelOfLuck;

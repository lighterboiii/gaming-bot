/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useEffect, useRef, useState } from 'react';

import { triggerHapticFeedback } from 'utils/hapticConfig';
import { getUserId } from 'utils/userConfig';

import { spinWheelRequest } from '../../../api/mainApi';
import lamp from '../../../images/closest-number/lamp.png';
import light from '../../../images/closest-number/lamp2.png';
import wheelPointer from '../../../images/closest-number/wheelPoint.png';
import { addTokens, setTokensValueAfterBuy } from '../../../services/appSlice';
import { useAppDispatch, useAppSelector } from '../../../services/reduxHooks';
import { IFortuneData, IFortuneItem } from '../../../utils/types/mainTypes';
import { ISpinWheelResponse } from '../../../utils/types/responseTypes';
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
  const [prize, setPrize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<IFortuneItem[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [noTokens, setNoTokens] = useState<boolean>(false);
  const [showPrizeAnimation, setShowPrizeAnimation] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;
    
    if (prize && visibleItems.length > 0) return;

    const max = data.fortune_all_items.length - 5;
    const randomIndex = Math.floor(Math.random() * max);
    setVisibleItems(data.fortune_all_items.slice(randomIndex, randomIndex + 5));
    setLoading(false);
  }, [data, prize, visibleItems.length]);

  const handlePrizeDispatch = (prizeItem: IFortuneItem) => {
    if (prizeItem.fortune_type === 'tokens') {
      dispatch(addTokens(prizeItem.fortune_item_count));
    }
  };

  const startSpin = () => {
    if (!data) return;

    spinWheelRequest(userId)
      .then(res => {
        console.log(res);
        const response = res as ISpinWheelResponse;
        if (response?.fortune_button_result?.message === 'ok') {
          triggerHapticFeedback('notification', 'success');
          setNoTokens(false);
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
            
            const prizeItem = (response?.fortune_prize_info && response.fortune_prize_info[0]) || null;
            const randomItems = [...data.fortune_all_items]
              .sort(() => Math.random() - 0.5)
              .slice(0, 4);
            
            const finalItems = [
              randomItems[0],
              randomItems[1],
              prizeItem,
              randomItems[2],
              randomItems[3]
            ].filter((item): item is IFortuneItem => item !== null);
            
            setVisibleItems(finalItems);
            
            setTimeout(() => {
              setSpinning(false);
              setPrize(true);
              setShowPrizeAnimation(true);
              if (prizeItem) {
                handlePrizeDispatch(prizeItem);
              }
              
              setTimeout(() => {
                setIsFadingOut(true);
                setTimeout(() => {
                  setShowPrizeAnimation(false);
                  setIsFadingOut(false);
                }, 500);
              }, 3500);
            }, 800);
          }, 5000);
        } else if (response?.fortune_button_result?.message === 'notokens') {
          setNoTokens(true);
          triggerHapticFeedback('notification', 'error');
          setTimeout(() => {
            closeOverlay();
            setNoTokens(false);
          }, 2500);
        }
      });
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
                    ${index === 2 && prize && showPrizeAnimation ? 
                      `${styles.wheel__specialItem} ${isFadingOut ? styles.fadeOut : ''}` 
                      : ''}`}
                >
                  <img
                    src={item.fortune_item_pic}
                    alt="item"
                    className={styles.wheel__itemImg}
                  />
                  <p className={styles.wheel__itemText}>{item.fortune_item_name}</p>
                </div>
              ))}
            </div>
          </div>
          {!spinning && (
            <div className={styles.wheel__buttonWrapper}>
              <Button 
                text={noTokens ? translation?.insufficient_funds : translation?.fortune_wheel_spin_button} 
                handleClick={startSpin} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WheelOfLuck;

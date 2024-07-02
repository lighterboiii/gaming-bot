/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import styles from './WheelOfLuck.module.scss';
import Button from '../../ui/Button/Button';
import wheelPointer from '../../../images/closest-number/wheelPoint.png';
import lamp from '../../../images/closest-number/lamp.png';
import light from '../../../images/closest-number/lamp2.png';
import { getWheelPrizeRequest, spinWheelRequest } from '../../../api/mainApi';
import { userId } from '../../../api/requestData';
import { useAppDispatch, useAppSelector } from '../../../services/reduxHooks';
import { setTokensValueAfterBuy } from '../../../services/appSlice';
import useTelegram from '../../../hooks/useTelegram';
import { IFortuneData } from '../../../utils/types/mainTypes';
import { postEvent } from '@tma.js/sdk';

interface IProps {
  data: IFortuneData;
  closeOverlay: () => void;
}

const WheelOfLuck: FC<IProps> = ({ data, closeOverlay }) => {
  const { user } = useTelegram();
  // const userId = user?.id;
  const dispatch = useAppDispatch();
  const translation = useAppSelector(store => store.app.languageSettings);
  const [prize, setPrize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<any>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [prizeItem, setPrizeItem] = useState<any>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const getRandomIndex = (length: number) => Math.floor(Math.random() * length);

  useEffect(() => {
    setLoading(true);
    const loadData = () => {
      if (data) {
        const max = data?.fortune_all_items.length - 4;
        const randomIndex = Math.floor(Math.random() * max);
        setVisibleItems(data?.fortune_all_items.slice(randomIndex, randomIndex + 4));
        setPrizeItem(data?.fortune_prize_info[0]);
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const startSpin = () => {
    spinWheelRequest(userId)
      .then((res: any) => {
        if (res?.message === 'ok') {
          dispatch(setTokensValueAfterBuy(100));
          postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
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
        } else if (res?.message === 'notokens') {
          console.log('Insufficient tokens');
        }
      })
  };

  const claimPrize = () => {
    getWheelPrizeRequest(userId, prizeItem?.fortune_item_id, prizeItem?.fortune_item_count)
      .then((res: any) => {
        if (res?.message === "ok") {
          postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success' });
        }
      })
    closeOverlay();
    setPrize(false);
    setVisibleItems(null);
  };

  return (
    <div className={styles.wheel}>
      {loading ?
        (
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
              {!spinning && !prize && <Button text={translation?.fortune_wheel_spin_button} handleClick={startSpin} />}
              {prize && !spinning && <Button text={translation?.fortune_wheel_get_button} handleClick={claimPrize} />}
            </div>
          </>)}
    </div>
  );
};

export default WheelOfLuck;
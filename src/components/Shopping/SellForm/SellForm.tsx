/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './SellForm.module.scss';
import Button from "../../ui/Button/Button";
import { sellLavkaRequest } from "../../../api/shopApi";
import { userId } from "../../../api/requestData";
import useTelegram from "../../../hooks/useTelegram";
import { useAppDispatch, useAppSelector } from "../../../services/reduxHooks";
import { ILavkaData } from "../../../utils/types/shopTypes";
import { addItemToLavka } from "../../../services/appSlice";
import { postEvent } from "@tma.js/sdk";

interface IProps {
  item: ILavkaData;
  setMessageShown: (value: boolean) => void;
  setMessage: (value: string) => void;
  onClose: () => void;
}

const SellForm: FC<IProps> = ({ item, setMessageShown, setMessage, onClose }) => {
  const { user } = useTelegram();
  const userId = user?.id;
  const dispatch = useAppDispatch();
  const translation = useAppSelector(store => store.app.languageSettings);
  const [priceValue, setPriceValue] = useState('')
  // продажа товара в лавку
  const handleSellToLavka = (itemId: number, price: number) => {
    sellLavkaRequest(itemId, price, userId)
      .then((res: any) => {
        const itemWithPrice = {
          ...item,
          item_price_coins: price,
          seller_id: +userId,
        };
        setMessageShown(true);
        switch (res.message) {
          case "already":
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'error', });
            setMessage(`${translation?.item_on_display}`);
            break;
          case "ok":
            postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success', });
            setMessage(`${translation?.listed_in_marketplace}`);
            dispatch(addItemToLavka(itemWithPrice));
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        onClose();
      });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    setPriceValue(value);
  };

  return (
    <div className={styles.sellModal}>
      <form className={styles.form}>
        <fieldset className={styles.form__fieldset}>
          <input
            required
            type="number"
            name="price"
            id="price"
            value={priceValue}
            className={styles.form__input}
            onChange={handlePriceChange}
            placeholder={translation?.enter_price}
          />
          {/* <input type="number" name="count" id="count" value={''} className={styles.form__input} /> */}
        </fieldset>
      </form>
      <div className={styles.sellModal__button}>
        <Button
          text={translation?.sell}
          handleClick={() => handleSellToLavka(item.item_id, Number(priceValue))}
          disabled={!priceValue}
        />
      </div>
    </div>
  )
};

export default SellForm;
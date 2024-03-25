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
      <h3>{data?.name}</h3>
      <div>
        <p>Ваш баланс</p>
        <div>
          <p>1200494</p>
          <p>123123123</p>
        </div>
      </div>
      <div>
        <p>Ставка в комнате:</p>
        <input type="text" />
        <input type="text" />
      </div>
      <div>
        <Button text='Создать' handleClick={() => {}} />
      </div>
    </div>
  )
};

export default GameSettings;
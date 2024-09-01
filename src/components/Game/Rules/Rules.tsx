import { FC } from 'react';

import { useAppSelector } from 'services/reduxHooks';

import Button from '../../../components/ui/Button/Button';

import styles from './Rules.module.scss';

interface IProps {
  handleRuleButtonClick: () => void;
  ruleImage: string;
}
const Rules: FC<IProps> = ({ handleRuleButtonClick, ruleImage }) => {
  const translation = useAppSelector(store => store.app.languageSettings);

  return (
    <div className={styles.rules}>
      <img
        src={ruleImage ? ruleImage : ''}
        alt="game rules"
        className={styles.rules__image}
      />
      <div className={styles.rules__button}>
        <Button text={translation?.understood} handleClick={handleRuleButtonClick} />
      </div>
    </div>
  )
};

export default Rules;
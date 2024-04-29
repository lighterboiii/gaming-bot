import { FC } from 'react';
import styles from './Task.module.scss';
import ChevronIcon from '../../../icons/Chevron/ChevronIcon';

interface IProps {
  task: any;
}

const Task: FC<IProps> = ({ task }) => {

  return (
    <div className={styles.task}>
      <div>
      <h2 className={styles.task__name}>{task?.desc_locale_key}</h2>
      <p className={styles.task__text}>Награда: скин</p>
      </div>
      <button type='button' className={styles.task__button}>
        <ChevronIcon color='#000' width={20} height={20} />
      </button>
    </div>
  );
};

export default Task;
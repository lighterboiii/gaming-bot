import { FC } from 'react';
import styles from './Task.module.scss';
import ChevronIcon from '../../../icons/Chevron/ChevronIcon';

interface IProps {
  task: any;
  onClick: () => void;
}

const Task: FC<IProps> = ({ task, onClick }) => {

  return (
    <div onClick={onClick} className={styles.task}>
      <div className={styles.task__container}>
        <img src={task?.task_img} alt="prize" className={styles?.task__image} />
        <div className={styles.task__textWrapper}>
          <h2 className={styles.task__name}>{task?.desc_locale_key}</h2>
          <p className={styles.task__text}>{task?.text_locale_key}</p>
        </div>
      </div>
      <button type='button' className={styles.task__button}>
        <ChevronIcon color='#000' width={20} height={20} />
      </button>
    </div>
  );
};

export default Task;
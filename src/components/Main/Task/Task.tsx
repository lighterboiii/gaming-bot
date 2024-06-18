import { FC } from 'react';
import styles from './Task.module.scss';
import ChevronIcon from '../../../icons/Chevron/ChevronIcon';
import checkIcon from '../../../images/check-icon.png';
import { ITask } from '../../../utils/types/mainTypes';

interface IProps {
  task: ITask;
  onClick: () => void;
}

const Task: FC<IProps> = ({ task, onClick }) => {
  
  const handleTaskClick = () => {
    task?.task_done === 0 ? onClick() : console.log('Task completed');
  };

  return (
    <div onClick={handleTaskClick} className={styles.task} style={task?.task_done === 1 ? { backgroundColor: '#E7E7E7' } : {}}>
      <div className={styles.task__container}>
        <img src={task?.task_img} alt="prize" className={styles?.task__image} />
        <div className={styles.task__textWrapper}>
          <h2 className={styles.task__name}>{task?.desc_locale_key}</h2>
          <p className={styles.task__text}>{task?.text_locale_key}</p>
        </div>
      </div>
      <button type='button' className={`${task?.task_done === 1 ? styles.task__completedButton : styles.task__button}`}>
        {task?.task_done === 0 && <ChevronIcon color='#000' width={20} height={20} />}
        {task?.task_done === 1 && <img src={checkIcon} alt="check icon" className={styles.task__check} />}
      </button>
    </div>
  );
};

export default Task;
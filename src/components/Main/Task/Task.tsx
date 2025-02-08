import { FC } from 'react';

import ChevronIcon from '../../../icons/Chevron/ChevronIcon';
import checkIcon from '../../../images/check-icon.png';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';
import { ITask } from '../../../utils/types/mainTypes';

import styles from './Task.module.scss';

interface ITaskProps {
  task: ITask;
  onClick: () => void;
}

const Task: FC<ITaskProps> = ({ task, onClick }) => {
  const handleTaskClick = (): void => {
    if (task?.task_done === 0) {
      onClick();
      triggerHapticFeedback('impact', 'soft');
    } else {
      triggerHapticFeedback('notification', 'success');
    }
  };

  const isTaskCompleted = task?.task_done === 1;

  return (
    <div 
      onClick={handleTaskClick}
      className={styles.task}
      style={isTaskCompleted ? { backgroundColor: '#E7E7E7' } : undefined}>
      <div className={styles.task__container}>
        <img src={task?.task_img}
          alt="prize"
          className={styles?.task__image} />
        <div className={styles.task__textWrapper}>
          <h2 className={styles.task__name}>{task?.desc_locale_key}</h2>
          <p className={styles.task__text}>{task?.text_locale_key}</p>
        </div>
      </div>
      <button 
        type='button'
        className={isTaskCompleted ? styles.task__completedButton : styles.task__button}
      >
        {!isTaskCompleted && (
          <ChevronIcon 
            color='#000'
            width={20}
            height={20}
          />
        )}
        {isTaskCompleted && (
          <img 
            src={checkIcon}
            alt="check icon"
            className={styles.task__check}
          />
        )}
      </button>
    </div>
  );
};

export default Task;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';

import { getUserId } from 'utils/userConfig';

import { getAppData } from '../../../api/mainApi';
import CrossIcon from '../../../icons/Cross/Cross';
import { setTaskList } from '../../../services/appSlice';
import { useAppDispatch, useAppSelector } from '../../../services/reduxHooks';
import { triggerHapticFeedback } from '../../../utils/hapticConfig';
import { ITask } from '../../../utils/types/mainTypes';
import Task from '../Task/Task';
import TaskInfo from '../TaskInfo/TaskInfo';

import styles from './Tasks.module.scss';

interface ITasksProps {
  onClose: () => void;
}

const Tasks: FC<ITasksProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const userId = getUserId();
  const currentTasks = useAppSelector(store => store.app.tasks);
  const translation = useAppSelector(store => store.app.languageSettings);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  useEffect(() => {
    setSelectedTask(null);
  }, []);

  useEffect(() => {
    return () => {
      setSelectedTask(null);
    };
  }, []);

  const handleTaskClick = (task: ITask) => {
    setSelectedTask(task);
  };

  const handleClose = () => {
    triggerHapticFeedback('impact', 'soft');
    onClose();
  };

  const fetchUserData = async (): Promise<void> => {
    try {
      const res = await getAppData(userId);
      dispatch(setTaskList(res.tasks_available));
      setSelectedTask(null);
    } catch (error) {
      console.error('Get user data error:', error);
    }
  };

  return (
    selectedTask === null ? (
      <>
        <div className={styles.tasks}>
          <h3 className={styles.tasks__title}>
            {translation?.tasks_menu}
          </h3>
          <div className={styles.tasks__blackContainer}>
            <p className={styles.tasks__text}>
              {translation?.tasks_menu_header}
            </p>
          </div>
          <div className={styles.tasks__board}>
            {currentTasks && currentTasks.map((task: ITask, index: number) => (
              <Task
                task={task}
                key={index}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
          <button 
            className={styles.tasks__closeBtn}
            onClick={handleClose}>
            <CrossIcon
              width={12}
              height={12}
              color='#FFF' />
          </button>
        </div>
      </>
    ) : (
      <TaskInfo
        fetchTaskInfo={fetchUserData}
        task={selectedTask}
        setSelectedTask={() => setSelectedTask(null)}
      />
    )
  );
};

export default Tasks;

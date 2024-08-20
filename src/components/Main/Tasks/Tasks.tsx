/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';

import { getAppData } from '../../../api/mainApi';
import { userId } from '../../../api/requestData';
import useTelegram from '../../../hooks/useTelegram';
import { setTaskList } from '../../../services/appSlice';
import { useAppDispatch, useAppSelector } from '../../../services/reduxHooks';
import { ITask } from '../../../utils/types';
import Task from '../Task/Task';
import TaskInfo from '../TaskInfo/TaskInfo';

import styles from './Tasks.module.scss';

const Tasks: FC = () => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useTelegram();
  // const userId = user?.id;
  const currentTasks = useAppSelector(store => store.app.tasks);
  const translation = useAppSelector(store => store.app.languageSettings);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const handleTaskClick = (task: ITask) => {
    setSelectedTask(task);
  };

  const fetchUserData = () => {
    getAppData(userId)
      .then((res) => {
        dispatch(setTaskList(res.tasks_available));
      })
      .catch((error) => {
        console.error('Get user data error:', error);
      })
  };

  useEffect(() => {

    return (() => {
      setSelectedTask(null);
    })
  }, [])
console.log(selectedTask);
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

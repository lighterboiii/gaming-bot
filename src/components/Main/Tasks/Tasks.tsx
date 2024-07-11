import { FC, useEffect, useState } from 'react';

import { useAppSelector } from 'services/reduxHooks';

import Task from '../Task/Task';
import TaskInfo from '../TaskInfo/TaskInfo';

import styles from './Tasks.module.scss';

const Tasks: FC = () => {
  const currentTasks = useAppSelector(store => store.app.tasks);
  const translation = useAppSelector(store => store.app.languageSettings);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
  };

  useEffect(() => {

    return(() => {
      setSelectedTask(null);
    })
  }, [])

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
            {currentTasks && currentTasks.map((task: any, index: number) => (
              <Task task={task}
key={index}
onClick={() => handleTaskClick(task)} />
            ))}
          </div>
        </div>
      </>
    ) : (
      <TaskInfo task={selectedTask}
setSelectedTask={() => setSelectedTask(null)} />
    )
  );
};

export default Tasks;

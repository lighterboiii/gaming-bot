/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';
import styles from './Tasks.module.scss';
import { useAppSelector } from '../../../services/reduxHooks';
import Task from '../Task/Task';

const Tasks: FC = () => {
  const currentTasks = useAppSelector(store => store.app.tasks);

  return (
    <div className={styles.tasks}>
      <h3 className={styles.tasks__title}>
        Задания
      </h3>
      <div className={styles.tasks__blackContainer}>
        <p className={styles.tasks__text}>
          Выполняйте задания, чтобы <br /> получить эксклюзивные предметы!
        </p>
      </div>
      <div className={styles.tasks__board}>
        {currentTasks && currentTasks.map((task: any, index: number) => (
          <Task task={task} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
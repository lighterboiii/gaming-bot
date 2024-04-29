import { FC } from "react";
import styles from './TaskInfo.module.scss';

interface IProps {
  task: any;
}

const TaskInfo: FC<IProps> = ({ task }) => {
  console.log(task);
  return (
    <div className={styles.info}>
      <h2>
        {task?.desc_locale_key}
      </h2>
    </div>
  )
};

export default TaskInfo;
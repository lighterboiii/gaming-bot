import { FC } from "react";
import styles from './TaskInfo.module.scss';
import Button from "../../ui/Button/Button";
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";

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
      <div className={styles.steps}>
        {task.steps.map((step: any) => (
          <div key={step.step_id} className={styles.info__step}>
            <img src={step.img} alt={step.step_type} className={styles.icon} />
            <div className={styles.stepContent}>
              <h3>{step.h_key}</h3>
              <button type='button' className={styles.info__button}>
                <ChevronIcon color='#000' width={20} height={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button text="Получить награду" handleClick={() => { }} />
      </div>
    </div>
  )
};

export default TaskInfo;
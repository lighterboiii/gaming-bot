/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './TaskInfo.module.scss';
import Button from "../../ui/Button/Button";
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import useTelegram from "../../../hooks/useTelegram";
import { postEvent } from "@tma.js/sdk";
import { useNavigate } from "react-router-dom";
import CrossIcon from "../../../icons/Cross/Cross";

interface IProps {
  task: any;
}

const TaskInfo: FC<IProps> = ({ task }) => {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  console.log(task);

  const handleClickTask = (step: any) => {
    if (step.step_type === "link") {
      window.open(step.target, '_blank');
    } else if (step.step_type === "instruction") {
      console.log("Instruction:", step.target);
    } else if (step.step_type === "subscribe") {
      tg.openTelegramLink(step.target);
    }
    postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'warning', });
  };

  const handleClaimReward = () => {
    console.log('reward Claimed');
  };

  return (
    <div className={styles.info}>
      <div className={styles.info__titleWrapper}>
        <h2 className={styles.info__title}>
          {task?.desc_locale_key}
        </h2>
        <p className={styles.info__reward}>Награда: скин</p>
      </div>
      <div className={styles.info__steps}>
        {task.steps.map((step: any) => (
          <div key={step.step_id} className={styles.info__step} onClick={() => handleClickTask(step)}>
            <img src={step.img} alt={step.step_type} className={styles.info__icon} />
            <h3 className={styles.info__text}>{step.h_key}</h3>
            <button type='button' className={styles.info__button}>
              <ChevronIcon color='#000' width={20} height={20} />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.info__buttonWrapper}>
        <Button text="Получить награду" handleClick={handleClaimReward} />
      </div>
      <button className={styles.info__closeBtn}>
        <CrossIcon width={12} height={12} color='#FFF' />
      </button>
    </div>
  )
};

export default TaskInfo;
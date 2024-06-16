/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState, useEffect } from "react";
import styles from './TaskInfo.module.scss';
import Button from "../../ui/Button/Button";
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import useTelegram from "../../../hooks/useTelegram";
import { postEvent } from "@tma.js/sdk";
import CrossIcon from "../../../icons/Cross/Cross";
import { taskResultRequest, taskStepRequest } from "../../../api/mainApi";
import { userId } from "../../../api/requestData";
import { useAppDispatch } from "../../../services/reduxHooks";
import { setNewTokensValue } from "../../../services/appSlice";

interface IProps {
  task: any;
  setSelectedTask: any;
}

const TaskInfo: FC<IProps> = ({ task, setSelectedTask }) => {
  const { tg, user } = useTelegram();
  const dispatch = useAppDispatch();
  const [showReward, setShowReward] = useState<boolean>(false);
  const [incomplete, setIncomplete] = useState<boolean>(false);
  const [rewardResult, setRewardResult] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const storedSteps = localStorage.getItem('completedSteps');
    if (storedSteps) {
      setCompletedSteps(JSON.parse(storedSteps));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedSteps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  const handleClickTaskStep = (step: any) => {
    if (step.step_type === "link") {
      window.open(step.target, '_blank');
    } else if (step.step_type === "instruction") {
      console.log("Instruction:", step.target);
    } else if (step.step_type === "subscribe") {
      tg.openTelegramLink(step.target);
    }
    taskStepRequest(userId, task?.task_id, step?.step_id)
      .then((res: any) => {
        console.log(res);
        if (res.message === 'ok') {
          setCompletedSteps(prevSteps => [...prevSteps, step.step_id]);
        }
      });
  };

  const handleClaimReward = () => {
    setShowReward(true);
    taskResultRequest(userId, task?.task_id)
      .then((res: any) => {
        console.log(res);
        if (res?.message === 'incomplete') {
          setIncomplete(true);
        } else if (res?.message === 'success') {
          setRewardResult(true);
          console.log(res?.prise);
          dispatch(setNewTokensValue(res?.new_value));
        }
      });
  };

  const handleClickBack = () => {
    if (showReward) {
      setShowReward(false);
    } else {
      setSelectedTask(null);
    }
  };

  return (
    <div className={styles.info}>
      {!showReward ? (
        <>
          <div className={styles.info__titleWrapper}>
            <h2 className={styles.info__title}>
              {task?.desc_locale_key}
            </h2>
            <p className={styles.info__reward}>{task?.text_locale_key}</p>
          </div>
          <div className={styles.info__steps}>
            {task.steps.map((step: any) => (
              <div key={step.step_id} className={styles.info__step} onClick={() => handleClickTaskStep(step)}>
                <img src={step.img} alt={step.step_type} className={styles.info__icon} />
                <h3 className={styles.info__text}>{step.h_key}</h3>
                {completedSteps.includes(step.step_id) ? (
                  <div className={styles.completedStep}>Завершено</div>
                ) : (
                  <button type='button' className={styles.info__button}>
                    <ChevronIcon color='#000' width={20} height={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className={styles.info__buttonWrapper}>
            <Button text="Получить награду" handleClick={handleClaimReward} />
          </div>
        </>
      ) : (
        <div className={styles.reward}>
          <h2 className={styles.info__title}>
            {task?.text_locale_key}
          </h2>
          <p>{incomplete ? "Задания не выполнены" : rewardResult ? "Награда ваша!" : ''}</p>
          <img src={task?.task_img} alt="reward" className={styles.reward__img} />
        </div>
      )}
      <button className={styles.info__closeBtn} onClick={handleClickBack}>
        <CrossIcon width={12} height={12} color='#FFF' />
      </button>
    </div>
  );
};

export default TaskInfo;

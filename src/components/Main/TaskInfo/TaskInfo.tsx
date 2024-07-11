/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { postEvent } from "@tma.js/sdk";
import { FC, useState } from "react";

import { taskResultRequest, taskStepRequest } from "API/mainApi";
import { userId } from "API/requestData";
import Button from "Components/ui/Button/Button";
import useTelegram from "Hooks/useTelegram";
import ChevronIcon from "Icons/Chevron/ChevronIcon";
import CrossIcon from "Icons/Cross/Cross";
import { setNewTokensValue } from "Services/appSlice";
import { useAppDispatch, useAppSelector } from "Services/reduxHooks";
import { ITask } from "Utils/types/mainTypes";

import styles from './TaskInfo.module.scss';

interface IProps {
  task: ITask;
  setSelectedTask: (task: ITask | null) => void;
}

const TaskInfo: FC<IProps> = ({ task, setSelectedTask }) => {
  const { tg, user } = useTelegram();
  // const userId = user?.id;
  const dispatch = useAppDispatch();
  const translation = useAppSelector(store => store.app.languageSettings);
  const [showReward, setShowReward] = useState<boolean>(false);
  const [incomplete, setIncomplete] = useState<boolean>(false);
  const [rewardResult, setRewardResult] = useState<boolean>(false);
  const [showInstruction, setShowInstruction] = useState<boolean>(false);
  const [target, setTarget] = useState('');

  const handleClickTaskStep = (step: any) => {
    if (step.step_type === "link") {
      window.open(step.target, '_blank');
    } else if (step.step_type === "instruction") {
      console.log("Instruction:", step.target);
      setTarget(step.target);
      setShowInstruction(true);
    } else if (step.step_type === "subscribe") {
      tg.openTelegramLink(step.target);
    }
    taskStepRequest(userId, task?.task_id, step?.step_id)
      .then((res: any) => {
      });
  };

  const handleClaimReward = () => {
    setShowReward(true);
    taskResultRequest(userId, task?.task_id)
      .then((res: any) => {
        if (res?.message === 'incomplete') {
          setIncomplete(true);
        } else if (res?.message === 'success') {
          setRewardResult(true);
          res?.new_value && dispatch(setNewTokensValue(res?.new_value));
          postEvent('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success', });
        }
      });
  };

  const handleClickBack = () => {
    if (showReward) {
      setShowReward(false);
    } else if (target) {
      setShowInstruction(false);
      setTarget('');
    } else {
      setSelectedTask(null);
    }
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
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
          {showInstruction ? (
            <div className={styles.info__instruction}>
              <h3 className={styles.info__textInstr}>{target}</h3>
            </div>
          ) : (
            <div className={styles.info__steps}>
              {task.steps.map((step: any) => (
                <div key={step.step_id} className={styles.info__step} onClick={() => handleClickTaskStep(step)}>
                  <>
                    <img src={step.img} alt={step.step_type} className={styles.info__icon} />
                    <h3 className={styles.info__text}>{step.h_key}</h3>
                    <button type='button' className={styles.info__button}>
                      <ChevronIcon color='#000' width={20} height={20} />
                    </button>
                  </>
                </div>
              ))}
            </div>
          )}
          {!target &&
            <div className={styles.info__buttonWrapper}>
              <Button text={translation?.tasks_get_reward} handleClick={handleClaimReward} />
            </div>}
        </>
      ) : (
        <div className={styles.reward}>
          <h2 className={styles.info__title}>
            {task?.text_locale_key}
          </h2>
          <p>{incomplete ? `${translation?.tasks_not_done}` : rewardResult ? "Награда ваша!" : ''}</p>
          <img src={task?.task_img}
            alt="reward"
            className={styles.reward__img} />
        </div>
      )}
      <button className={styles.info__closeBtn}
        onClick={handleClickBack}>
        <CrossIcon width={12}
          height={12}
          color='#FFF' />
      </button>
    </div>
  );
};

export default TaskInfo;

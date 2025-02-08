/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import { FC, useState } from "react";

import { getUserId } from "utils/userConfig";

import { taskResultRequest, taskStepRequest } from "../../../api/mainApi";
import useTelegram from "../../../hooks/useTelegram";
import CrossIcon from "../../../icons/Cross/Cross";
import { setNewTokensValue } from "../../../services/appSlice";
import { useAppDispatch, useAppSelector } from "../../../services/reduxHooks";
import { triggerHapticFeedback } from "../../../utils/hapticConfig";
import { ITask, ITaskStep } from "../../../utils/types/mainTypes";
import { IClaimRewardResponse } from "../../../utils/types/responseTypes";
import Button from "../../ui/Button/Button";
import { TaskStep } from "../TaskStep/TaskStep";

import styles from './TaskInfo.module.scss';

interface IProps {
  task: ITask;
  setSelectedTask: (task: ITask | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchTaskInfo: any;
}

const TaskInfo: FC<IProps> = ({ task, setSelectedTask, fetchTaskInfo }) => {
  const { tg, user } = useTelegram();
  const userId = getUserId();
  const dispatch = useAppDispatch();
  const translation = useAppSelector(store => store.app.languageSettings);
  const [showReward, setShowReward] = useState<boolean>(false);
  const [incomplete, setIncomplete] = useState<boolean>(false);
  const [rewardResult, setRewardResult] = useState<boolean>(false);
  const [showInstruction, setShowInstruction] = useState<boolean>(false);
  const [target, setTarget] = useState('');

  const handleClickTaskStep = (step: ITaskStep) => {
    if (step.step_type === "link") {
      tg.openLink(step.target, {
        try_instant_view: false,
      });
    } else if (step.step_type === "instruction") {
      setTarget(step.target);
      setShowInstruction(true);
    } else if (step.step_type === "subscribe") {
      tg.openTelegramLink(step.target);
    }
    taskStepRequest(userId, task?.task_id, step?.step_id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(res => { });
  };

  const handleClaimReward = () => {
    setShowReward(true);
    taskResultRequest(userId, task?.task_id)
      .then((res) => {
        const response = res as IClaimRewardResponse;
        if (response?.message === 'incomplete') {
          setIncomplete(true);
        } else if (response?.message === 'success') {
          setRewardResult(true);
          fetchTaskInfo();
          response?.new_value && dispatch(setNewTokensValue(response?.new_value));
          triggerHapticFeedback('notification', 'success');
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
    triggerHapticFeedback('impact', 'soft');
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
              {task.steps.map((step: ITaskStep) => (
                <TaskStep step={step} handleClickTaskStep={handleClickTaskStep} />
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
          <p>{incomplete ? `${translation?.tasks_not_done}` : rewardResult ? `${translation?.reward_yours}` : ''}</p>
          <img src={task?.task_img}
            alt="reward"
            className={styles.reward__img} />
        </div>
      )}
      <button className={styles.info__closeBtn}
        onClick={handleClickBack}>
        <CrossIcon
          width={12}
          height={12}
          color='#FFF' />
      </button>
    </div>
  );
};

export default TaskInfo;

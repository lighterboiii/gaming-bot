import { FC } from "react";

import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import { ITaskStep } from "../../../utils/types/mainTypes";

import styles from './TaskStep.module.scss';

interface IProps {
  step: ITaskStep;
  handleClickTaskStep: (step: ITaskStep) => void;
}

export const TaskStep: FC<IProps> = ({ step, handleClickTaskStep }) => {
  return (
    <div key={step.step_id} className={styles.step} onClick={() => handleClickTaskStep(step)}>
      <>
        <img src={step.img} alt={step.step_type} className={styles.step__icon} />
        <h3 className={styles.step__text}>{step.h_key}</h3>
        <button type='button' className={styles.step__button}>
          <ChevronIcon color='#000' width={20} height={20} />
        </button>
      </>
    </div>
  )
};
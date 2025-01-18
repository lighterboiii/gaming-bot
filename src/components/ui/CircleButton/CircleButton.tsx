/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";

import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import CommunityIcon from "../../../icons/Community/CommunityIcon";
import CrossIcon from "../../../icons/Cross/Cross";
import FortuneWheelIcon from "../../../icons/FortuneWheel/FortuneWheel";
import RefIcon from "../../../icons/Referral/ReferralIcon";
import tasksIcon from '../../../images/tasks_3.png';
import { triggerHapticFeedback } from "../../../utils/hapticConfig";

import styles from './CircleButton.module.scss';

interface IProps {
  chevronPosition?: string;
  width?: number;
  height?: number;
  color?: string;
  shadow?: boolean;
  isWhiteBackground?: boolean;
  iconType: 'community' | 'chevron' | 'cross' | 'ref' | 'fortune' | 'tasks';
}

const CircleButton: FC<IProps> = ({
  chevronPosition = "right",
  width = 20,
  height = 20,
  color = "#d51845",
  shadow = false,
  isWhiteBackground,
  iconType,
}) => {

  const handleClick = () => {
    triggerHapticFeedback('impact', 'light');
  }

  return (
    <div
      onClick={handleClick}
      className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.pinkButton}`}
      style={shadow ? { boxShadow: '2px 1px 1.2px 1px rgba(0, 0, 0, 0.5)' } : undefined}
    >
      {iconType === 'chevron' && <ChevronIcon position={chevronPosition}
        color={color}
        width={width}
        height={height} />}
      {iconType === 'ref' && <RefIcon />}
      {iconType === 'cross' && <CrossIcon color={color} />}
      {iconType === 'fortune' && <FortuneWheelIcon />}
      {iconType === 'community' && <CommunityIcon />}
      {iconType === 'tasks' && <img src={tasksIcon}
        alt="tasks icon"
        className={styles.button__tasks} />}
    </div>
  )
}

export default CircleButton;

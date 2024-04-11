/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './CircleButton.module.scss';
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import RefIcon from "../../../icons/Referral/ReferralIcon";
import CrossIcon from "../../../icons/Cross/Cross";
import wheelIcon from '../../../images/hub/fortune_icon_hub.png';
import comunityIcon from '../../../images/hub/messages_icon_hub.png';
import { postEvent } from "@tma.js/sdk";

interface IProps {
  chevronPosition?: string;
  width?: number;
  height?: number;
  color?: string;
  shadow?: boolean;
  isWhiteBackground?: boolean;
  iconType: 'community' | 'chevron' | 'cross' | 'ref' | 'fortune';
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
    postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft', });
  }

  return (
    <div
      onClick={handleClick}
      className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.pinkButton}`}
      style={shadow ? { boxShadow: '2px 1px 1.2px 1px rgba(0, 0, 0, 0.5)' } : undefined}

    >
      {iconType === 'chevron' && <ChevronIcon position={chevronPosition} color={color} width={width} height={height} />}
      {iconType === 'ref' && <RefIcon />}
      {iconType === 'cross' && <CrossIcon color={color} />}
      {iconType === 'community' && <img src={comunityIcon} alt="icon" style={{ width: width, height: height }} />}
      {iconType === 'fortune' && <img src={wheelIcon} alt="icon" style={{ width: width, height: height }} />}
    </div>
  )
}

export default CircleButton;
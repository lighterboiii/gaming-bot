/* eslint-disable @typescript-eslint/no-unused-vars */
import { postEvent } from "@tma.js/sdk";
import React, { FC } from "react";

import ChevronIcon from "../../../icons/Chevron/ChevronIcon";

import styles from './SmallButton.module.scss';

interface IProps {
  text: string | React.ReactNode;
  secondaryText: string;
  isWhiteBackground?: boolean;
  chevronPosition?: string;
  shadow?: boolean;
  handleClick: () => void;
}

const SmallButton: FC<IProps> = ({ text, secondaryText, isWhiteBackground, chevronPosition, shadow, handleClick }) => {

  const handleGetHapticFeedback = () => {
    // postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light', });
    handleClick();
  };

  return (
    <button
      onClick={handleGetHapticFeedback}
      className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.blackButton}`}
      style={shadow ? { boxShadow: '2px 2px 1.2px 1px rgba(0, 0, 0, 0.5)' } : undefined}
    >
      <div className={styles.button__textWrapper}>
        <p
          className={`${styles.button__text} ${isWhiteBackground ? styles.secondaryTextColor : ''}`}
        >
          {text}
        </p>
        <p
          className={`${styles.button__secondaryText} ${isWhiteBackground ? styles.secondaryAlternativeTextColor : ''}`}
        >
          {secondaryText}
        </p>
      </div>
      <div className={styles.button__chevronWrapper}>
        <ChevronIcon
          position={chevronPosition}
          width={24}
          height={24}
          color={isWhiteBackground ? '#FF0080' : '#ffdb50'}
        />
      </div>
    </button>
  )
}

export default SmallButton;

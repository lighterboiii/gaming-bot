/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from "react";
import { Link } from "react-router-dom";

import { triggerHapticFeedback } from "../../../utils/hapticConfig";
import CircleButton from "../CircleButton/CircleButton";

import styles from './BigButton.module.scss';

interface IProps {
  to: string;
  text: string | React.ReactNode;
  secondaryText: string;
  isWhiteBackground?: boolean;
  chevronPosition: string;
  circleIconColor?: string;
  shadow?: boolean;
}

const BigButton: FC<IProps> = ({
  to, text, secondaryText, isWhiteBackground, chevronPosition, circleIconColor, shadow
}) => {

  const handleGetHapticFeedback = () => {
    triggerHapticFeedback('impact', 'heavy');
  };

  return (
    <Link
      to={to}
      onClick={handleGetHapticFeedback}
      className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.blackButton}`}
      style={shadow ? { boxShadow: '2px 2px 1.2px 1px rgba(0, 0, 0, 0.5)' } : undefined}
    >
      <p className={styles.button__text}>{text}</p>
      <p className={styles.button__secondaryText}>{secondaryText}</p>
      <div className={styles.button__buttonContainer}>
        <CircleButton
          chevronPosition={chevronPosition}
          color={circleIconColor}
          iconType="chevron"
          width={24}
          height={24}
        />
      </div>
    </Link>
  )
}

export default BigButton;

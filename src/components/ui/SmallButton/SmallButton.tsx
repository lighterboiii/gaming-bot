import { FC } from "react";
import styles from './SmallButton.module.scss';
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import { Link } from "react-router-dom";
import { postEvent } from "@tma.js/sdk";

interface IProps {
  to: string;
  text: string;
  secondaryText: string;
  isWhiteBackground?: boolean;
  chevronPosition?: string;
  shadow?: boolean;
}

const SmallButton: FC<IProps> = ({ to, text, secondaryText, isWhiteBackground, chevronPosition, shadow }) => {
  const handleClick = () => {
    postEvent('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: 'medium',
    });
  };
  
  return (
    <Link
      to={to}
      onClick={handleClick}
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
          width={16}
          height={16}
          color={isWhiteBackground ? '#FF0080' : '#ffdb50'}
        />
      </div>
    </Link>
  )
}

export default SmallButton;
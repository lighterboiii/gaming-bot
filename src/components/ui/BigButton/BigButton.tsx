import { FC } from "react";
import styles from './BigButton.module.scss';
import { Link } from "react-router-dom";
import CircleButton from "../CircleButton/CircleButton";

interface IProps {
  to: string;
  text: string;
  secondaryText: string;
  isWhiteBackground?: boolean;
  chevronPosition: string;
  circleIconColor?: string;
  shadow?: boolean;
}

const BigButton: FC<IProps> = ({ to, text, secondaryText, isWhiteBackground, chevronPosition, circleIconColor, shadow }) => {
  return (
    <Link
      to={to}
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
        width={20} 
        height={20} 
        />
      </div>
    </Link>
  )
}

export default BigButton;
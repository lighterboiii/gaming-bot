import { FC } from "react";
import styles from './SmallButton.module.scss';
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import { Link } from "react-router-dom";

interface IProps {
  to: string;
  text: string;
  secondaryText: string;
  isWhiteBackground?: boolean;
  chevronPosition?: string;
  shadow?: boolean;
}

const SmallButton: FC<IProps> = ({ to, text, secondaryText, isWhiteBackground, chevronPosition, shadow }) => {
  return (
    <Link
      to={to}
      className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.blackButton}`}
      style={shadow ? { boxShadow: '3px 2px 1.5px 1px rgba(0, 0, 0, 0.5)' } : undefined}
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
    </Link>
  )
}

export default SmallButton;
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
}

const SmallButton: FC<IProps> = ({ to, text, secondaryText, isWhiteBackground, chevronPosition }) => {
  return (
    <Link
      to={to}
      className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.pinkButton}`}
    >
      <div className={styles.button__textWrapper}>
        <p className={`${styles.button__text} ${isWhiteBackground ? styles.secondaryTextColor : ''}`}>{text}</p>
        <p className={styles.button__secondaryText}>{secondaryText}</p>
      </div>
      <div className={styles.button__chevronWrapper}>
        <ChevronIcon 
        position="right" 
        width={24} 
        height={24} 
        color={isWhiteBackground ? '#FF0080' : '#FFF'}
        />
      </div>
    </Link>
  )
}

export default SmallButton;
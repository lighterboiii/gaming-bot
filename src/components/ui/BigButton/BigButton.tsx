import { FC } from "react";
import styles from './BigButton.module.scss';
import { Link } from "react-router-dom";
import CircleButton from "../CircleButton/CircleButton";

interface IProps {
  to: string;
  text: string;
  isWhiteBackground?: boolean;
  chevronPosition: string;
}

const BigButton: FC<IProps> = ({ to, text, isWhiteBackground, chevronPosition }) => {
  return (
    <Link
      to={to}
      className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.pinkButton}`}
    >
      <p className={styles.button__text}>{text}</p>
      <div className={styles.button__buttonContainer}>
        <CircleButton chevronPosition={chevronPosition} />
      </div>
    </Link>
  )
}

export default BigButton;
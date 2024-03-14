import { FC } from "react";
import styles from './Button.module.scss';

interface IProps {
  text: string;
  isWhiteBackground?: boolean;
  handleClick: () => void;
}

const Button: FC<IProps> = ({ text, isWhiteBackground, handleClick}) => {
  return (
    <button 
    className={styles.button} 
    style={{ backgroundColor: !isWhiteBackground ? '#ffdb50' : '#FFF' }}
    onClick={handleClick}
    >
      {text}
    </button>
  )
}

export default Button;
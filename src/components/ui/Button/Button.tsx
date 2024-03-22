import { FC } from "react";
import styles from './Button.module.scss';

interface IProps {
  text: string;
  isWhiteBackground?: boolean;
  handleClick: () => void;
  disabled?: boolean;
}

const Button: FC<IProps> = ({ text, isWhiteBackground, handleClick, disabled }) => {
  
  return (
    <button
      className={styles.button}
      style={{ 
        backgroundColor: (!isWhiteBackground && !disabled) ? '#ffdb50' : '#FFF',
      }}
      onClick={handleClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button;
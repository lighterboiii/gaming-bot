import { FC } from "react";
import styles from './Button.module.scss';
// import { postEvent } from "@tma.js/sdk";

interface IProps {
  text: string;
  isWhiteBackground?: boolean;
  handleClick: () => void;
  disabled?: boolean;
}

const Button: FC<IProps> = ({ text, isWhiteBackground, handleClick, disabled }) => {

  // const handleButtonClick = () => {
  //   handleClick();
  //   postEvent('web_app_trigger_haptic_feedback', {
  //     type: 'impact',
  //     impact_style: 'light',
  //   });
  // }
  
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
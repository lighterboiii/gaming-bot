import { FC } from "react";
import styles from './Button.module.scss';

interface IProps {
  text: string;
  isWhiteBackground?: boolean;
}

const Button: FC<IProps> = ({ text, isWhiteBackground}) => {

  return (
    <button className={styles.button} style={{ backgroundColor: !isWhiteBackground ? '#ffdb50' : '#FFF' }}>
      {text}
    </button>
  )
}

export default Button;
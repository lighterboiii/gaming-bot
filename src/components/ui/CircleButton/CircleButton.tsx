import { FC } from "react";
import styles from './CircleButton.module.scss';
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";


const CircleButton: FC = () => {
  return (
  <div className={styles.button}>
    <ChevronIcon />
  </div>
  )
}

export default CircleButton;
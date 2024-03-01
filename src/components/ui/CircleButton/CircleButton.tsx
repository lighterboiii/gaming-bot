import { FC } from "react";
import styles from './CircleButton.module.scss';
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";

interface IProps {
  chevronPosition?: string;
  width?: number;
  height?: number;
  color?: string;
}

const CircleButton: FC<IProps> = ({
  chevronPosition = "right",
  width = 24,
  height = 24,
  color = "#FF0080"
}) => {

  return (
    <div className={styles.button}>
      <ChevronIcon position={chevronPosition} color={color} width={width} height={height} />
    </div>
  )
}

export default CircleButton;
import { FC } from "react";
import styles from './CircleButton.module.scss';
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import CommunityIcon from "../../../icons/Community/CommunityIcon";

interface IProps {
  chevronPosition?: string;
  width?: number;
  height?: number;
  color?: string;
  shadow?: boolean;
  isWhiteBackground?: boolean;
  chevron?: boolean;
  community?: boolean;
}

const CircleButton: FC<IProps> = ({
  chevronPosition = "right",
  width = 24,
  height = 24,
  color = "#d51845",
  shadow = false,
  isWhiteBackground,
  chevron,
  community,
}) => {

  return (
    <div 
    className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.pinkButton}`} 
    style={shadow ? { boxShadow: '2px 1px 1.2px 1px rgba(0, 0, 0, 0.5)' } : undefined}
    
    >
      {chevron && <ChevronIcon position={chevronPosition} color={color} width={width} height={height} />}
      {community && <CommunityIcon />}
    </div>
  )
}

export default CircleButton;
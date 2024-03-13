import { FC } from "react";
import styles from './CircleButton.module.scss';
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";

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
  color = "#f01151",
  shadow = false,
  isWhiteBackground,
  chevron,
  community,
}) => {

  return (
    <div 
    className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.pinkButton}`} 
    style={shadow ? { boxShadow: '3px 2px 5px 1px rgba(0, 0, 0, 0.5)' } : undefined}
    
    >
      {chevron && <ChevronIcon position={chevronPosition} color={color} width={width} height={height} />}
      {/* {community && <img src={CommunityPng} alt="community" />} */}
    </div>
  )
}

export default CircleButton;
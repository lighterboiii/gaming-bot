import { FC } from "react";
import styles from './CircleButton.module.scss';
import ChevronIcon from "../../../icons/Chevron/ChevronIcon";
import RefIcon from "../../../icons/Referral/ReferralIcon";
import CrossIcon from "../../../icons/Cross/Cross";

interface IProps {
  chevronPosition?: string;
  width?: number;
  height?: number;
  color?: string;
  shadow?: boolean;
  isWhiteBackground?: boolean;
  iconType: 'community' | 'chevron' | 'cross' | 'ref';
}

const CircleButton: FC<IProps> = ({
  chevronPosition = "right",
  width = 20,
  height = 20,
  color = "#d51845",
  shadow = false,
  isWhiteBackground,
  iconType,
}) => {

  return (
    <div 
    className={`${styles.button} ${isWhiteBackground ? styles.whiteButton : styles.pinkButton}`} 
    style={shadow ? { boxShadow: '2px 1px 1.2px 1px rgba(0, 0, 0, 0.5)' } : undefined}
    
    >
      {iconType === 'chevron' && <ChevronIcon position={chevronPosition} color={color} width={width} height={height} />}
      {iconType === 'ref' && <RefIcon />}
      {iconType === 'cross' && <CrossIcon color={color} />}
      {}
    </div>
  )
}

export default CircleButton;
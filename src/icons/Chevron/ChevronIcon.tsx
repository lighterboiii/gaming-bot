import { FC } from 'react';

import { ICommonIconProps } from '../../utils/types/mainTypes';

import styles from './ChevronIcon.module.scss';

export interface IChevronIcon extends ICommonIconProps {
  position?: string;
  strokeWidth?: number;
}

const ChevronIcon: FC<IChevronIcon> = ({
  color,
  position = "right",
  width = 16,
  height = 16,
  strokeWidth = 2,
}) => {

  let rotation: string;

  switch (position) {
    case 'left':
      rotation = 'rotate(90deg)';
      break;
    case 'up':
      rotation = 'rotate(180deg)';
      break;
    case 'right':
      rotation = 'rotate(-90deg)';
      break;
    case 'down':
      rotation = 'rotate(0deg)';
      break;
    default:
      rotation = 'rotate(-90deg)';
      break;
  }

  return (
    <div style={{ transform: rotation }}
className={styles.div}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.6667 6.28027L8.00001 10.9469L3.33334 6.28027"
          stroke={color || '#FFF'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChevronIcon;

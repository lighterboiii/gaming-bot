/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';

export interface IChevronIcon {
  color?: string;
  position?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

const ChevronIcon: FC<IChevronIcon> = ({
  color,
  position = "right",
  width = 16,
  height = 16,
  strokeWidth = 2,
}) => {
  const [rot, setRot] = useState('rotate(-90');
  useEffect(() => {
    let rotation: string;

    switch (position) {
      case 'left':
        rotation = 'rotate(90)';
        setRot('rotate(90)');
        break;
      case 'up':
        rotation = 'rotate(180)';
        setRot('rotate(180)');
        break;
      case 'right':
        rotation = 'rotate(-90)';
        setRot('rotate(-90)');
        break;
      case 'down':
        rotation = 'rotate(0)';
        setRot('rotate(0)');
        break;
      default:
        rotation = 'rotate(-90)';
        setRot('rotate(-90)');
        break;
    }
  }, [])

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={rot}
    >
      <path
        d="M12.6667 6.28027L8.00001 10.9469L3.33334 6.28027"
        stroke={color || '#FFF'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronIcon;

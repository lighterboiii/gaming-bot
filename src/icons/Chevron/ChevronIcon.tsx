import React, { FC } from 'react';

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
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transform={
      (position === 'left' && 'rotate(90)') ||
      (position === 'up' && 'rotate(180)') ||
      (position === 'right' && 'rotate(-90)') ||
      (position === 'down' && 'rotate(0)') ||
      'rotate(0)'
    }
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

export default ChevronIcon;
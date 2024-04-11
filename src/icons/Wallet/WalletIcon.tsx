import { FC } from 'react';
import { ICommonIconProps } from '../../utils/types/mainTypes';

const WalletIcon: FC<ICommonIconProps> = ({
  color = '#FFF',
  width = 20,
  height = 20,
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
      width={width}
      height={height}
      x="0"
      y="0"
      viewBox="0 0 24 24"
    >
      <g>
        <path d="M19.5 16c-2.481 0-4.5-2.019-4.5-4.5S17.019 7 19.5 7H22V5.75A2.752 2.752 0 0 0 19.25 3H2.75A2.752 2.752 0 0 0 0 5.75v12.5A2.752 2.752 0 0 0 2.75 21h16.5A2.752 2.752 0 0 0 22 18.25V16z"
          fill={color}
          opacity="1"
          data-original="#000000"
        >
        </path>
        <path d="M23.25 8.5H19.5c-1.654 0-3 1.346-3 3s1.346 3 3 3h3.75a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75zm-3.75 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
          fill={color}
          opacity="1"
          data-original="#000000"
        >
        </path>
      </g>
    </svg>
  );
};

export default WalletIcon;

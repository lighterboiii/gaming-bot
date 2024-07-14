import { FC } from 'react';

import { ICommonIconProps } from '../../utils/types/mainTypes';

const ManIcon: FC<ICommonIconProps> = ({
  color = "#F50941",
  width = 16,
  height = 16,
}) => {

  return (
    <svg width={width}
height={height}
viewBox="0 0 19 20"
fill="none"
xmlns="http://www.w3.org/2000/svg">
      <circle cx="9.16671"
cy="5.83333"
r="5.83333"
fill={color} />
      <path d="M0 13.3333C0 10.5719 2.23858 8.33331 5 8.33331H13.3333C16.0948 8.33331 18.3333 10.5719 18.3333 13.3333V20H0V13.3333Z"
fill="#F50941" />
    </svg>
  );
};

export default ManIcon;

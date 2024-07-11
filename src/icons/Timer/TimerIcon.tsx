import { FC } from 'react';

import { ICommonIconProps } from 'Utils/types/mainTypes';

const TimerIcon: FC<ICommonIconProps> = ({
  color = '#FFF',
  width = 20,
  height = 20,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={width}
      height={height}
      x="0"
      y="0"
      viewBox="0 0 612 612"
    >
      <g>
        <path
          d="M583.728 375.793c-12.316 124.001-112.79 223.666-236.88 235.068C200.16 624.34 75.077 516.49 60.568 376.312H34.716c-15.717 0-25.54-17.016-17.68-30.626l57.818-100.122c7.859-13.609 27.503-13.608 35.361.001l57.807 100.122c7.858 13.611-1.965 30.625-17.681 30.625h-22.506c14.621 104.659 112.057 183.152 223.772 166.778 82.667-12.115 149.722-77.336 163.773-159.697 21.031-123.271-73.829-230.558-193.271-230.558-38.734 0-76.119 11.238-108.233 32.519-14.904 9.876-35.564 7.922-46.498-6.223-11.905-15.402-8.188-37.389 7.687-48.109C209.52 107.746 248.58 93.2 289.503 88.135V50.184h-26.784c-9.215 0-16.686-7.47-16.686-16.686V16.686C246.033 7.47 253.503 0 262.719 0H386.93c9.215 0 16.686 7.47 16.686 16.686v16.812c0 9.215-7.47 16.686-16.686 16.686h-29.502v38.347c136.852 18.465 240.674 142.531 226.3 287.262zm8.642-252.528L542.058 76.76c-6.768-6.255-17.324-5.84-23.58.927l-13.309 14.399c-6.256 6.767-5.841 17.324.927 23.58l50.312 46.504c6.768 6.254 17.324 5.84 23.58-.927l13.309-14.399c6.256-6.767 5.841-17.324-.927-23.579zm-271.052 63.874v163.194h161.565c.002-99.384-75.402-163.194-161.565-163.194z"
          fill={color}
          opacity="1"
          data-original="#000000"
        >
        </path>
      </g>
    </svg>
  );
};

export default TimerIcon;

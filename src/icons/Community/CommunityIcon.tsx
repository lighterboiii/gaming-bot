import { FC } from 'react';
// import styles from './ChevronIcon.module.scss';

export interface ICommunityIcon {
  color?: string;
  position?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

const CommunityIcon: FC<ICommunityIcon> = ({
  color = '#d51845',
  width = 16,
  height = 16,
  strokeWidth = 2,
}) => {
  return (
    <div>
      <svg width={width} height={height} viewBox="0 0 23 23" fill={color} stroke={color}  xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width={width} height={height} fill="url(#pattern0)" />
        <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_41_626" transform="translate(0 -0.00408163) scale(0.00102041)" />
          </pattern>
        </defs>
      </svg>

    </div>
  );
};

export default CommunityIcon;

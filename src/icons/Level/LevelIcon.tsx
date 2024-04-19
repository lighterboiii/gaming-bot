import { FC } from 'react';
import styles from './LevelIcon.module.scss';

export interface ILevelIcon {
  color?: string;
  width?: number;
  height?: number;
  level?: number;
}

const LevelIcon: FC<ILevelIcon> = ({
  color = '#ffdb50',
  width = 15,
  height = 15,
  level,
}) => {
  return (
    <div className={styles.icon}>
      <svg
        width={width}
        height={height}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px" y="0px"
        viewBox="0 0 512 512">
        <g fill={color}>
          <path d="M65.5,375.1l26.9,15.6c54.1-8.6,108.8-12.9,163.6-12.9c54.8,0,109.5,4.3,163.6,12.9l26.9-15.6
        c14.1-8.1,22.5-22.7,22.5-39v-194c0-16.3-8.4-30.8-22.5-39l-168-97c-14.1-8.1-30.9-8.1-45,0l-168,97c-14.1,8.1-22.5,22.7-22.5,39
        v194C43,352.4,51.4,366.9,65.5,375.1L65.5,375.1z"/>
          <path d="M500,437.5c-160.3-39.8-327.8-39.8-488.1,0c-3.6,0.9-5,5.3-2.6,8.1c8.2,9.6,16.3,19.4,24.3,29.3
        c-2.9,10.2-5.7,20.5-8.4,30.8c-0.9,3.7,2.4,7,6.1,6.1c147.6-36.5,301.8-36.5,449.4,0c3.7,0.9,7-2.4,6.1-6.1
        c-2.7-10.3-5.5-20.6-8.4-30.8c7.9-9.9,16-19.7,24.3-29.3C505.1,442.8,503.7,438.4,500,437.5L500,437.5z"/>
        </g>
      </svg>
      <span className={styles.icon__text}>
        {level}
      </span>
    </div>
  );
};

export default LevelIcon;
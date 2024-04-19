import { FC } from 'react';
import styles from './Cross.module.scss';
import { ICommonIconProps } from '../../utils/types/mainTypes';

export interface ICrossIcon extends ICommonIconProps {
  position?: string;
}

const CrossIcon: FC<ICrossIcon> = ({
  color,
  position = "right",
  width = 16,
  height = 16,
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
    <div style={{ transform: rotation }} className={styles.div}>
      <svg width={width} height={height} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.567992 15.8838C0.357662 15.6735 0.252497 15.4345 0.252497 15.1668C0.252497 14.8991 0.357661 14.6601 0.567991 14.4498L5.81667 9.2011L0.711399 4.09583C0.50107 3.8855 0.386345 3.63692 0.367224 3.35011C0.367224 3.08242 0.472389 2.84341 0.682719 2.63308L2.77645 0.539342C2.98678 0.329012 3.22579 0.223847 3.49349 0.223848C3.7803 0.242969 4.02887 0.357693 4.2392 0.568022L9.34448 5.6733L14.4498 0.568022C14.6601 0.357692 14.8991 0.252528 15.1668 0.252529C15.4345 0.252528 15.6735 0.357692 15.8838 0.568022L18.2357 2.91989C18.4269 3.1111 18.5225 3.34055 18.5225 3.60824C18.5416 3.89506 18.446 4.14363 18.2357 4.35396L13.1304 9.45923L18.207 14.5358C18.4173 14.7462 18.5225 14.9852 18.5225 15.2529C18.5225 15.5206 18.4173 15.7596 18.207 15.9699L16.1133 18.0636C15.9029 18.274 15.6639 18.3791 15.3962 18.3791C15.1285 18.3791 14.8895 18.274 14.6792 18.0636L9.60261 12.987L4.35393 18.2357C4.1436 18.446 3.89502 18.5417 3.60821 18.5225C3.34052 18.5225 3.11107 18.4269 2.91986 18.2357L0.567992 15.8838Z" 
        fill={color || '#FFF'} 
        />
      </svg>

    </div>
  );
};

export default CrossIcon;

import { FC } from 'react';

export interface ICommunityIcon {
  color?: string;
  width?: number;
  height?: number;
}

const CommunityIcon: FC<ICommunityIcon> = ({
  color = '#f50941',
  width = 22,
  height = 22,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={width}
      height={height}
      x="0"
      y="0"
      viewBox="0 0 404 404"
    >
      <g>
        <path
          d="M325.62 382.649a13.64 13.64 0 0 1 9.482 3.829c16.621 16.05 40.866 21.394 62.419 14.705-13.871-28.897-15.793-62.003-5.044-92.656 13.34-38.138 16.683-76.364 1.501-114.702-13.338-33.679-39.077-61.66-71.652-77.616a176.53 176.53 0 0 1 3.014 32.571c.001 46.695-17.955 90.613-50.557 123.665-32.606 33.056-76.314 51.643-123.071 52.338a176.856 176.856 0 0 1-25.885-1.502c25.697 45.043 74.161 74.379 127.417 75.169 23.297.36 45.666-4.521 66.498-14.469a13.611 13.611 0 0 1 5.878-1.332z"
          fill={color}
          opacity="1"
          data-original="#000000">
        </path>
        <path
          d="M152.097.03C69.151-1.617.2 65.485 0 148.413c-.049 20.261 3.906 39.905 11.756 58.389.114.269.22.541.316.817 10.749 30.653 8.828 63.758-5.044 92.656 21.555 6.686 45.797 1.345 62.419-14.706a13.644 13.644 0 0 1 15.36-2.496c20.829 9.948 43.201 14.844 66.497 14.47 82.297-1.222 146.762-66.567 146.761-148.764C298.066 68.376 232.584 1.648 152.097.03zm-82.56 170.969c-11.917 0-21.578-9.645-21.578-21.542s9.661-21.542 21.578-21.542 21.578 9.645 21.578 21.542c-.001 11.897-9.661 21.542-21.578 21.542zm79.496 0c-11.917 0-21.578-9.645-21.578-21.542s9.661-21.542 21.578-21.542 21.578 9.645 21.578 21.542-9.661 21.542-21.578 21.542zm79.497 0c-11.917 0-21.578-9.645-21.578-21.542s9.661-21.542 21.578-21.542 21.578 9.645 21.578 21.542-9.661 21.542-21.578 21.542z"
          fill={color}
          opacity="1"
          data-original="#000000">
        </path>
      </g>
    </svg>
  );
};

export default CommunityIcon;
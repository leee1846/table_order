import type { IconProps } from './types';

const KeyboardArrowDownIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12.8284 14.5718C12.3709 15.0293 11.6293 15.0293 11.1718 14.5718L6.70011 10.1001C6.31351 9.71351 6.31351 9.08671 6.70011 8.70011C7.08671 8.31351 7.71351 8.31351 8.10011 8.70011L12.0001 12.6001L15.9001 8.70011C16.2867 8.31351 16.9135 8.31351 17.3001 8.70011C17.6867 9.08671 17.6867 9.71351 17.3001 10.1001L12.8284 14.5718Z"
      fill={color}
    />
  </svg>
);

export default KeyboardArrowDownIcon;

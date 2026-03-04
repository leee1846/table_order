import type { IconProps } from './types';

const ChevronForwardIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12.6001 12.0001L8.70011 8.10011C8.31351 7.71351 8.31351 7.08671 8.70011 6.70011C9.08671 6.31351 9.71351 6.31351 10.1001 6.70011L14.5188 11.1188C15.0055 11.6055 15.0055 12.3947 14.5188 12.8814L10.1001 17.3001C9.71351 17.6867 9.08671 17.6867 8.70011 17.3001C8.31351 16.9135 8.31351 16.2867 8.70011 15.9001L12.6001 12.0001Z"
      fill={color}
    />
  </svg>
);

export default ChevronForwardIcon;

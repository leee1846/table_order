import type { IconProps } from './types';

const ChevronBackwardIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M14.7001 17.3001C14.3135 17.6867 13.6867 17.6867 13.3001 17.3001L8.87265 12.8726C8.39076 12.3908 8.39076 11.6095 8.87265 11.1276L13.3001 6.70011C13.6867 6.31351 14.3135 6.31351 14.7001 6.70011C15.0867 7.08671 15.0867 7.71351 14.7001 8.10011L10.8001 12.0001L14.7001 15.9001C15.0867 16.2867 15.0867 16.9135 14.7001 17.3001Z"
      fill={color}
    />
  </svg>
);

export default ChevronBackwardIcon;

import type { IconProps } from './types';

const ArrowDropDownIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12.5303 14.4697C12.2374 14.7626 11.7625 14.7626 11.4696 14.4697L8.28026 11.2803C7.80778 10.8079 8.14241 10 8.81059 10H15.1893C15.8574 10 16.1921 10.8079 15.7196 11.2803L12.5303 14.4697Z"
      fill={color}
    />
  </svg>
);

export default ArrowDropDownIcon;

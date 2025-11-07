import type { IconProps } from './types';

const RemoveIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M18.0752 11.3999C18.6689 11.3999 19.1504 11.8814 19.1504 12.4751C19.1504 13.0688 18.6689 13.5503 18.0752 13.5503H6.0752C5.48149 13.5503 5 13.0688 5 12.4751C5 11.8814 5.48149 11.3999 6.0752 11.3999H18.0752Z"
      fill={color}
    />
  </svg>
);

export default RemoveIcon;

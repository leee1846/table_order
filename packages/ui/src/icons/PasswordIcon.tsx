import type { IconProps } from './types';

const PasswordIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 15 15" fill="none" {...props}>
    <path
      d="M8.54064 5.72221L13.9525 2.67134L15 4.44247L9.59356 7.48802L15 10.5362L13.9525 12.3074L8.54064 9.25648V15H6.44572V9.26447L1.04883 12.3074L0.00136388 10.5362L5.40371 7.48802L0 4.44247L1.04746 2.67134L6.44572 5.71422V0H8.54064V5.72221Z"
      fill={color}
    />
  </svg>
);

export default PasswordIcon;

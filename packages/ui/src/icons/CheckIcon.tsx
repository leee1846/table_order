import type { IconProps } from './types';

const CheckIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M10.1662 17.384C9.82585 17.7243 9.27407 17.7243 8.93375 17.384L4.56246 13.0127C4.16896 12.6192 4.16896 11.9812 4.56246 11.5877C4.95596 11.1942 5.59396 11.1942 5.98746 11.5877L9.54996 15.1502L18.0125 6.68771C18.406 6.2942 19.044 6.2942 19.4375 6.68771C19.831 7.08121 19.831 7.7192 19.4375 8.11271L10.1662 17.384Z"
      fill={color}
    />
  </svg>
);

export default CheckIcon;

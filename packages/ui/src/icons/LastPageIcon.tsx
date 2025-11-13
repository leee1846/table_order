import type { IconProps } from './types';

const LastPageIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <g clipPath="url(#clip0_707_4522)">
      <path
        d="M6.29495 6.705C5.90559 7.09436 5.90559 7.72564 6.29495 8.115L10.18 12L6.29495 15.885C5.90559 16.2744 5.90559 16.9056 6.29495 17.295C6.68431 17.6844 7.31559 17.6844 7.70495 17.295L12.2928 12.7071C12.6834 12.3166 12.6834 11.6834 12.2928 11.2929L7.70495 6.705C7.31559 6.31564 6.68431 6.31564 6.29495 6.705ZM16 7C16 6.44772 16.4477 6 17 6C17.5522 6 18 6.44772 18 7V17C18 17.5523 17.5522 18 17 18C16.4477 18 16 17.5523 16 17V7Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_707_4522">
        <rect width={width} height={height} fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default LastPageIcon;

import type { IconProps } from './types';

const PaymentsIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M19 14V6C19 4.9 18.1 4 17 4H3C1.9 4 1 4.9 1 6V14C1 15.1 1.9 16 3 16H17C18.1 16 19 15.1 19 14ZM17 14H3V6H17V14ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7ZM22 7C22.5523 7 23 7.44772 23 8V18C23 19.1 22.1 20 21 20H5C4.44772 20 4 19.5523 4 19C4 18.4477 4.44772 18 5 18H20.3125C20.6922 18 21 17.6922 21 17.3125V8C21 7.44772 21.4477 7 22 7Z"
      fill={color}
    />
  </svg>
);

export default PaymentsIcon;

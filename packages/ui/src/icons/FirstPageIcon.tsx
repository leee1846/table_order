import type { IconProps } from './types';

const FirstPageIcon = ({
  width = 24,
  height = 24,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <g clipPath="url(#clip0_707_4523)">
      <path
        d="M17.705 17.295C18.0944 16.9056 18.0944 16.2744 17.705 15.885L13.82 12L17.705 8.115C18.0944 7.72564 18.0944 7.09436 17.705 6.705C17.3156 6.31564 16.6844 6.31564 16.295 6.705L11.7071 11.2929C11.3166 11.6834 11.3166 12.3166 11.7071 12.7071L16.295 17.295C16.6844 17.6844 17.3156 17.6844 17.705 17.295ZM6 7C6 6.44772 6.44772 6 7 6C7.55228 6 8 6.44772 8 7V17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17V7Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_707_4523">
        <rect width={width} height={height} fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FirstPageIcon;

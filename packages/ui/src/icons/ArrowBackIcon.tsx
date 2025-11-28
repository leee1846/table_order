import type { IconProps } from './types';

interface Props extends IconProps {
  color?: string;
}

const ArrowBackIcon = ({ width = 24, height = 24, color, ...props }: Props) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z"
      {...(color !== undefined && { fill: color })}
    />
  </svg>
);

export default ArrowBackIcon;

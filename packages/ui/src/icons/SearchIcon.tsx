import React from 'react';

export type SearchIconProps = React.SVGProps<SVGSVGElement>;

const SearchIcon = (props: SearchIconProps) => (
  <svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z"
      fill={props.color ?? 'none'}
    />
  </svg>
);

export default SearchIcon;

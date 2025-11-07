import { SerializedStyles } from '@emotion/react';
import * as S from './chipButton.style';

export type TVariant =
  | 'gradient'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'darkgrey'
  | 'lightGreen'
  | 'white'
  | 'lightGrey'
  | 'lightYellow'
  | 'lightOrange'
  | 'lightRed'
  | 'lightBlue';

export type TSize = 'S' | 'M' | 'L';

interface Props {
  variant: TVariant;
  size: TSize;
  children: React.ReactNode;
  onClick?: () => void;
  customStyle?: SerializedStyles;
}

export const ChipButton = ({
  children,
  variant,
  size,
  onClick,
  customStyle,
}: Props) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <S.Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      css={customStyle}
    >
      {children}
    </S.Button>
  );
};

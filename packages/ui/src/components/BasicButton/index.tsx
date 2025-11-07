'use client';

import type { ReactNode } from 'react';
import * as S from './basicButton.styles';
import type { VariantKey } from './basicButton.styles';
import { SerializedStyles } from '@emotion/react';

interface Props {
  children: ReactNode;
  variant?: VariantKey;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  customStyle?: SerializedStyles;
}

export const BasicButton = ({
  children,
  variant = 'Solid_Navy_M',
  disabled = false,
  onClick,
  fullWidth,
  customStyle,
}: Props) => {
  const handleClick = (_e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <S.ButtonStyle
      type="button"
      variant={variant}
      disabled={disabled}
      onClick={handleClick}
      fullWidth={fullWidth}
      css={customStyle}
    >
      {children}
    </S.ButtonStyle>
  );
};

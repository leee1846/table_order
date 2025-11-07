'use client';

import type { ReactNode } from 'react';
import * as S from './basicButton.styles';
import type { VariantKey } from './basicButton.styles';

interface Props {
  children: ReactNode;
  variant?: VariantKey;
  disabled?: boolean;
  onClick?: () => void;
}

export const BasicButton = ({
  children,
  variant = 'Solid_Navy_M',
  disabled = false,
  onClick,
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
    >
      {children}
    </S.ButtonStyle>
  );
};

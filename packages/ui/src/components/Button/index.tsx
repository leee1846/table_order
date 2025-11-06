'use client';

import type { ReactNode } from 'react';
import * as S from './buttonStyle.styles';

interface Props {
  children: ReactNode;
  variant?: 'navy' | 'outline' | 'skyBlue' | 'outlineGrey';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button = ({
  children,
  variant = 'navy',
  size = 'md',
  disabled = false,
  onClick,
}: Props) => {
  return (
    <S.ButtonStyle
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </S.ButtonStyle>
  );
};

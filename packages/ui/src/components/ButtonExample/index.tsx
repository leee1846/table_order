'use client';

import type { ReactNode } from 'react';
import * as S from './buttonExample.styles';

interface Props {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}
/**
 * packages/ui/ButtonExample 예시 컴포넌트입니다.
 */
export const ButtonExample = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className,
  onClick,
}: Props) => {
  return (
    <S.StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      onClick={onClick}
    >
      {children}
    </S.StyledButton>
  );
};

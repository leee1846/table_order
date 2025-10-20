'use client';

import type { ReactNode } from 'react';
import { StyledButton } from '@/Button/button.styles';

interface Props {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className,
  onClick,
}: Props) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

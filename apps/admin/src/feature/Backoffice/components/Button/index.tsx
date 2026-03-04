'use client';

import type { ReactNode } from 'react';
import * as S from './button.styles';
import type { VariantKey } from './button.styles';
import type { SerializedStyles } from '@emotion/react';

interface Props {
  children?: ReactNode;
  variant?: VariantKey;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  customStyle?: SerializedStyles;
  type?: 'button' | 'submit' | 'reset';
  size?: 'default' | 'icon';
}

export const Button = ({
  children,
  variant = 'default',
  disabled = false,
  onClick,
  fullWidth,
  customStyle,
  type = 'button',
  size = 'default',
}: Props) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <S.ButtonStyle
      type={type}
      variant={variant}
      disabled={disabled}
      onClick={handleClick}
      fullWidth={fullWidth}
      size={size}
      css={customStyle}
    >
      {children}
    </S.ButtonStyle>
  );
};

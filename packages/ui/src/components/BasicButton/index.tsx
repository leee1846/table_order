'use client';

import type { ReactNode } from 'react';
import * as S from './basicButton.styles';
import type { VariantKey } from './basicButton.styles';
import { SerializedStyles } from '@emotion/react';

interface Props {
  children?: ReactNode;
  variant?: VariantKey;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  customStyle?: SerializedStyles;
  icon?: ReactNode; // 버튼 좌우에 추가할 아이콘
  iconPosition?: 'left' | 'right'; // 아이콘 위치
}

export const BasicButton = ({
  children,
  variant = 'Solid_Navy_M',
  disabled = false,
  onClick,
  fullWidth,
  customStyle,
  icon,
  iconPosition = 'left',
}: Props) => {
  const handleClick = (_e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const iconStyle = {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    marginRight: iconPosition === 'left' ? 6 : 0,
    marginLeft: iconPosition === 'right' ? 6 : 0,
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
      {icon && <span style={iconStyle}>{icon}</span>}
      {children}
    </S.ButtonStyle>
  );
};

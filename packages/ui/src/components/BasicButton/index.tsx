'use client';

import type { ReactNode } from 'react';
import * as S from './basicButton.styles';

type TVariant =
  | 'Solid_Navy_S'
  | 'Solid_Navy_M'
  | 'Solid_Navy_L'
  | 'Solid_Navy_XL'
  | 'Solid_Navy_2XL'
  | 'Outline_Navy_S'
  | 'Outline_Navy_M'
  | 'Outline_Navy_L'
  | 'Outline_Navy_XL'
  | 'Outline_Navy_2XL'
  | 'Solid_Sky_Blue_S'
  | 'Solid_Sky_Blue_M'
  | 'Solid_Sky_Blue_L'
  | 'Solid_Sky_Blue_XL'
  | 'Solid_Sky_Blue_2XL'
  | 'Outline_Grey_S'
  | 'Outline_Grey_M'
  | 'Outline_Grey_L'
  | 'Outline_Grey_XL'
  | 'Outline_Grey_2XL'
  | 'Solid_Grey_S'
  | 'Solid_Grey_M'
  | 'Solid_Grey_L'
  | 'Solid_Grey_XL'
  | 'Solid_Grey_2XL';

interface Props {
  children: ReactNode;
  variant: TVariant;
  disabled?: boolean;
  onClick?: () => void;
}

export const BasicButton = ({
  children,
  variant = 'Solid_Navy_M',
  disabled = false,
  onClick,
}: Props) => {
  return (
    <S.ButtonStyle
      type="button"
      variant={variant}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </S.ButtonStyle>
  );
};

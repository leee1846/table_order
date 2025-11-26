import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import { TYPOGRAPHY } from '../../theme/typography';
import { colors } from '../../theme/colors';
import type { Theme } from '@emotion/react/macro';

export type ButtonSize = 'S' | 'M' | 'L' | 'XL' | '2XL';

export type VariantType =
  | 'Solid_Navy'
  | 'Solid_Sky_Blue'
  | 'Solid_Grey'
  | 'Outline_Navy'
  | 'Outline_Grey'
  | 'Solid_Blue'
  | 'Outline_Blue';

export type VariantKey =
  | 'Solid_Navy_S'
  | 'Solid_Navy_M'
  | 'Solid_Navy_L'
  | 'Solid_Navy_XL'
  | 'Solid_Navy_2XL'
  | 'Solid_Sky_Blue_S'
  | 'Solid_Sky_Blue_M'
  | 'Solid_Sky_Blue_L'
  | 'Solid_Sky_Blue_XL'
  | 'Solid_Sky_Blue_2XL'
  | 'Solid_Grey_S'
  | 'Solid_Grey_M'
  | 'Solid_Grey_L'
  | 'Solid_Grey_XL'
  | 'Solid_Grey_2XL'
  | 'Outline_Navy_S'
  | 'Outline_Navy_M'
  | 'Outline_Navy_L'
  | 'Outline_Navy_XL'
  | 'Outline_Navy_2XL'
  | 'Outline_Grey_S'
  | 'Outline_Grey_M'
  | 'Outline_Grey_L'
  | 'Outline_Grey_XL'
  | 'Outline_Grey_2XL'
  | 'Solid_Blue_S'
  | 'Solid_Blue_M'
  | 'Solid_Blue_L'
  | 'Solid_Blue_XL'
  | 'Solid_Blue_2XL'
  | 'Outline_Blue_S'
  | 'Outline_Blue_M'
  | 'Outline_Blue_L'
  | 'Outline_Blue_XL'
  | 'Outline_Blue_2XL';

const sizeStyles: Record<ButtonSize, SerializedStyles> = {
  S: css`
    ${TYPOGRAPHY.CT_1}
    padding: 6px 10px;
    border-radius: 8px;
    height: 30px;
  `,
  M: css`
    ${TYPOGRAPHY.BD_1}
    padding: 10px 14px;
    border-radius: 12px;
    height: 40px;
  `,
  L: css`
    ${TYPOGRAPHY.ST_3}
    padding: 10px 16px;
    border-radius: 12px;
    height: 44px;
  `,
  XL: css`
    ${TYPOGRAPHY.ST_1}
    padding: 12px 18px;
    border-radius: 14px;
    height: 50px;
  `,
  '2XL': css`
    ${TYPOGRAPHY.MT_6}
    padding: 15px 24px;
    border-radius: 16px;
    height: 60px;
  `,
};

const getSolidColor = (
  main: string,
  text: string,
  border: string,
  disabled: boolean,
  theme: Theme
) => {
  const disabledBg = theme.mode.grey[200];
  const disabledText = theme.mode.grey[500];
  const disabledBorder = theme.mode.grey[100];

  return css`
    background: ${disabled ? disabledBg : main};
    color: ${disabled ? disabledText : text};
    border: ${disabled ? `1px solid ${disabledBorder}` : `1px solid ${border}`};
  `;
};

const getOutlineColor = (
  background: string,
  text: string,
  border: string,
  disabled: boolean,
  theme: Theme
) => {
  const disabledBg = theme.mode.white;
  const disabledText = theme.mode.grey[500];
  const disabledBorder = theme.mode.grey[500];

  return css`
    background: ${disabled ? disabledBg : background};
    border: 1px solid ${disabled ? disabledBorder : border};
    color: ${disabled ? disabledText : text};
  `;
};

type VariantStyleFn = (
  size: ButtonSize,
  disabled: boolean,
  theme: Theme
) => SerializedStyles;

const variantStyles: Record<VariantType, VariantStyleFn> = {
  Solid_Navy: (size, disabled, theme) => css`
    ${sizeStyles[size]}
    ${getSolidColor(colors.primary[600], colors.white, 'none', disabled, theme)}
  `,
  Solid_Sky_Blue: (size, disabled, theme) => css`
    ${sizeStyles[size]}
    ${getSolidColor(
      colors.primary[100],
      colors.primary[600],
      colors.primary[200],
      disabled,
      theme
    )}
  `,
  Solid_Grey: (size, disabled, theme) => css`
    ${sizeStyles[size]}
    ${getSolidColor(
      colors.grey[100],
      colors.grey[800],
      colors.grey[300],
      disabled,
      theme
    )}
  `,
  Outline_Navy: (size, disabled, theme) => css`
    ${sizeStyles[size]}
    ${getOutlineColor(
      colors.white,
      colors.primary[600],
      colors.primary[600],
      disabled,
      theme
    )}
  `,
  Outline_Grey: (size, disabled, theme) => css`
    ${sizeStyles[size]}
    ${getOutlineColor(
      colors.grey[50],
      colors.grey[700],
      colors.grey[400],
      disabled,
      theme
    )}
  `,
  Solid_Blue: (size, disabled, theme) => {
    const mainColor = theme.mode.primary[500];
    const textColor = theme.mode.background[100];

    return css`
      ${sizeStyles[size]}
      ${getSolidColor(mainColor, textColor, 'none', disabled, theme)}
    `;
  },
  Outline_Blue: (size, disabled, theme) => {
    const textColor = theme.mode.primary[500];
    const borderColor = theme.mode.primary[500];

    return css`
      ${sizeStyles[size]}
      ${getOutlineColor(colors.white, textColor, borderColor, disabled, theme)}
    `;
  },
};

const VARIANT_TYPE_MAP: Record<string, VariantType> = {
  Solid_Navy: 'Solid_Navy',
  Solid_Sky_Blue: 'Solid_Sky_Blue',
  Solid_Grey: 'Solid_Grey',
  Outline_Navy: 'Outline_Navy',
  Outline_Blue: 'Outline_Blue',
  Solid_Blue: 'Solid_Blue',
  Outline_Grey: 'Outline_Grey',
} as const;

function parseVariant(v: VariantKey): { type: VariantType; size: ButtonSize } {
  const arr = v.split('_');
  const variantStr = arr.slice(0, arr.length - 1).join('_');
  const sizeStr = arr[arr.length - 1];

  const type = VARIANT_TYPE_MAP[variantStr] || 'Outline_Grey';
  const size: ButtonSize = sizeStr === '2XL' ? '2XL' : (sizeStr as ButtonSize);

  return { type, size };
}

export const ButtonStyle = styled.button<{
  variant: VariantKey;
  disabled: boolean;
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  white-space: nowrap;
  user-select: none;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  ${({ variant, disabled, theme }) => {
    const { type, size } = parseVariant(variant);
    if (!variantStyles[type]) {
      return '';
    }
    return variantStyles[type](size, disabled, theme);
  }}
`;

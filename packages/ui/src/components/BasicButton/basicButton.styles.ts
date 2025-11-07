import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import { TYPOGRAPHY } from '../../theme/typography';
import { colors } from '../../theme/colors';

export type ButtonSize = 'S' | 'M' | 'L' | 'XL' | '2XL';

export type VariantType =
  | 'Solid_Navy'
  | 'Solid_Sky_Blue'
  | 'Solid_Grey'
  | 'Outline_Navy'
  | 'Outline_Grey';

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
  | 'Outline_Grey_2XL';

//SerializedStyles :Emotion/react에서 쓰이는 라이브러리 타입, css함수 반환값이 스타일 객체임을 ts가 이해함
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
  disabled: boolean
) => css`
  background: ${disabled ? colors.grey[200] : main};
  color: ${disabled ? colors.grey[500] : text};
  border: ${disabled ? `1px solid ${colors.grey[100]}` : `1px solid ${border}`};
`;

const getOutlineColor = (
  background: string,
  text: string,
  border: string,
  disabled: boolean
) => css`
  background: ${disabled ? colors.white : background};
  border: 1px solid ${disabled ? colors.grey[500] : border};
  color: ${disabled ? colors.grey[500] : text};
`;

type VariantStyleFn = (size: ButtonSize, disabled: boolean) => SerializedStyles;

const variantStyles: Record<VariantType, VariantStyleFn> = {
  Solid_Navy: (size, disabled) => css`
    ${sizeStyles[size]}
    ${getSolidColor(colors.primary[600], colors.white, 'none', disabled)}
  `,
  Solid_Sky_Blue: (size, disabled) => css`
    ${sizeStyles[size]}
    ${getSolidColor(
      colors.primary[200],
      colors.primary[600],
      colors.primary[200],
      disabled
    )}
  `,
  Solid_Grey: (size, disabled) => css`
    ${sizeStyles[size]}
    ${getSolidColor(
      colors.grey[100],
      colors.grey[800],
      colors.grey[300],
      disabled
    )}
  `,
  Outline_Navy: (size, disabled) => css`
    ${sizeStyles[size]}
    ${getOutlineColor(
      colors.white,
      colors.primary[600],
      colors.primary[600],
      disabled
    )}
  `,
  Outline_Grey: (size, disabled) => css`
    ${sizeStyles[size]}
    ${getOutlineColor(
      colors.grey[50],
      colors.grey[700],
      colors.grey[400],
      disabled
    )}
  `,
};

function parseVariant(v: VariantKey): { type: VariantType; size: ButtonSize } {
  const arr = v.split('_');
  const variantStr = arr.slice(0, arr.length - 1).join('_');
  const sizeStr = arr[arr.length - 1];
  let type: VariantType;
  // type 추론
  if (variantStr === 'Solid_Navy') {
    type = 'Solid_Navy';
  } else if (variantStr === 'Solid_Sky_Blue') {
    type = 'Solid_Sky_Blue';
  } else if (variantStr === 'Solid_Grey') {
    type = 'Solid_Grey';
  } else if (variantStr === 'Outline_Navy') {
    type = 'Outline_Navy';
  } else {
    type = 'Outline_Grey';
  }
  // size 추론
  const size: ButtonSize = sizeStr === '2XL' ? '2XL' : (sizeStr as ButtonSize);
  return { type, size };
}

export const ButtonStyle = styled.button<{
  variant: VariantKey;
  disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  white-space: nowrap;
  user-select: none;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);

  ${({ variant, disabled }) => {
    const { type, size } = parseVariant(variant);
    if (!variantStyles[type]) {
      return '';
    }
    return variantStyles[type](size, disabled);
  }}
`;

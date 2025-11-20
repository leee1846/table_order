import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { TVariant } from '.';
import { TYPOGRAPHY } from '../../theme/typography';

interface Props {
  variant: TVariant;
  disabled: boolean;
  value: number;
}

const getBorderRadius = (variant: TVariant): string => {
  const BORDER_RADIUS: Record<TVariant, string> = {
    square: '0.75rem',
    rounded: '62.4rem',
  };

  return BORDER_RADIUS[variant];
};

const isRoundedActive = (variant: TVariant, value: number): boolean => {
  return variant === 'rounded' && value > 0;
};

const getBackgroundColor = (
  variant: TVariant,
  value: number,
  disabled: boolean
): string => {
  if (disabled || !isRoundedActive(variant, value)) {
    return colors.grey[50];
  }
  return colors.primary[500];
};

const getTextColor = (
  variant: TVariant,
  value: number,
  disabled: boolean
): string => {
  if (disabled) {
    return colors.grey[500];
  }
  if (isRoundedActive(variant, value)) {
    return colors.white;
  }
  return colors.grey[900];
};

export const Container = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 11.25rem;
  height: 3.25rem;
  padding: 4px 0;
  border: 1px solid ${colors.grey[300]};
  border-radius: ${({ variant }) => getBorderRadius(variant)};
  background-color: ${({ variant, value, disabled }) =>
    getBackgroundColor(variant, value, disabled)};

  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 2.75rem;
    width: 2.75rem;
    padding: 0;
    border-radius: ${({ variant }) => getBorderRadius(variant)};

    &:disabled {
      cursor: not-allowed;
    }
  }

  & > input {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 0;
    text-align: center;
    ${TYPOGRAPHY.MT_6}
    color: ${({ variant, value, disabled }) =>
      getTextColor(variant, value, disabled)};
    border: none;
    background: transparent;
    outline: none;

    &:disabled {
      cursor: not-allowed;
    }
  }

  &:focus-within {
    border-color: ${({ disabled }) =>
      disabled ? colors.grey[300] : colors.primary[500]};
    background-color: ${({ variant, disabled }) =>
      disabled
        ? colors.grey[50]
        : variant === 'rounded'
          ? colors.primary[500]
          : colors.grey[50]};

    & > input {
      color: ${({ variant, disabled }) =>
        disabled
          ? colors.grey[500]
          : variant === 'rounded'
            ? colors.white
            : colors.grey[900]};
    }

    & > button {
      & > svg {
        color: ${({ variant, disabled }) =>
          disabled
            ? colors.grey[400]
            : variant === 'rounded'
              ? colors.white
              : colors.grey[800]} !important;
        fill: ${({ variant, disabled }) =>
          disabled
            ? colors.grey[400]
            : variant === 'rounded'
              ? colors.white
              : colors.grey[800]} !important;
      }
    }
  }
`;

import { RemoveIcon, AddIcon } from '../../icons';
import * as S from './numberInput.style';
import { SerializedStyles } from '@emotion/react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useId } from 'react';

export type TVariant = 'square' | 'rounded';

interface Props {
  variant: TVariant;
  size?: 'L' | 'M';
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  customStyle?: SerializedStyles;
}

export const NumberInput = ({
  variant,
  size = 'L',
  value,
  min,
  max,
  disabled,
  onChange,
  customStyle,
}: Props) => {
  const id = useId();
  const { theme } = useThemeMode();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // 숫자가 아닌 문자 제거 및 leading zero 제거
    const sanitized =
      e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '') || '0';
    const newValue = Number(sanitized);

    if (min !== undefined && newValue < min) {
      onChange(min);
      return;
    }

    if (max !== undefined && newValue > max) {
      onChange(max);
      return;
    }

    onChange(newValue);
  };

  const handleDecrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const newValue = value - 1;
    if (min !== undefined && newValue < min) {
      onChange(min);
      return;
    }
    onChange(newValue);
  };

  const handleIncrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const newValue = value + 1;
    if (max !== undefined && newValue > max) {
      onChange(max);
      return;
    }
    onChange(newValue);
  };

  const getIconColor = (type: 'remove' | 'add') => {
    if (disabled) {
      return theme.mode.grey[400];
    }

    if (variant === 'rounded' && value > 0) {
      return theme.mode.grey[50];
    }

    // 버튼의 실제 disabled 상태 확인
    const isDecreaseDisabled = disabled || (min !== undefined && value <= min);
    const isIncreaseDisabled = disabled || (max !== undefined && value >= max);

    if (type === 'remove' && isDecreaseDisabled) {
      return theme.mode.grey[400];
    }

    if (type === 'add' && isIncreaseDisabled) {
      return theme.mode.grey[400];
    }

    return theme.mode.grey[800];
  };

  return (
    <S.Container
      variant={variant}
      size={size}
      disabled={disabled ?? false}
      value={value}
      css={customStyle}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || (min !== undefined && value <= min)}
      >
        <RemoveIcon color={getIconColor('remove')} />
      </button>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || (max !== undefined && value >= max)}
      >
        <AddIcon color={getIconColor('add')} />
      </button>
    </S.Container>
  );
};

import { RemoveIcon, AddIcon } from '../../icons';
import * as S from './numberInput.style';
import { SerializedStyles } from '@emotion/react';
import { useThemeMode } from '../../hooks/useThemeMode';

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
  const { theme } = useThemeMode();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (min && newValue < min) {
      onChange(min);
      return;
    }

    if (max && newValue > max) {
      onChange(max);
      return;
    }

    onChange(newValue);
  };

  const handleDecrease = () => {
    const newValue = value - 1;
    if (min !== undefined && newValue < min) {
      onChange(min);
      return;
    }
    onChange(newValue);
  };

  const handleIncrease = () => {
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

    if (type === 'remove') {
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
        type="number"
        value={value}
        onChange={handleChange}
        disabled={disabled}
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

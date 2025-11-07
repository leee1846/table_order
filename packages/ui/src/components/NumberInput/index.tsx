import { colors } from '../../theme/colors';
import { RemoveIcon, AddIcon } from '../../icons';
import * as S from './numberInput.style';

export type TVariant = 'square' | 'rounded';

interface Props {
  variant: TVariant;
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export const NumberInput = ({
  variant,
  value,
  min,
  max,
  disabled,
  onChange,
}: Props) => {
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

  const getIconColor = (type: 'remove' | 'add') => {
    if (disabled) {
      return colors.grey[400];
    }
    if (variant === 'rounded' && value > 0) {
      return colors.white;
    }
    return type === 'remove' ? colors.grey[400] : colors.grey[800];
  };

  return (
    <S.Container variant={variant} disabled={disabled ?? false} value={value}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled}
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
        onClick={() => onChange(value + 1)}
        disabled={disabled}
      >
        <AddIcon color={getIconColor('add')} />
      </button>
    </S.Container>
  );
};

import { useId, useRef, useState } from 'react';
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
  const id = useId();
  const { theme } = useThemeMode();
  const [temporaryInputText, setTemporaryInputText] = useState<string | null>(
    null
  );
  const valueWhenEditStartedRef = useRef(value);

  const isTemporaryInput = temporaryInputText !== null;
  const inputDisplayText = isTemporaryInput
    ? temporaryInputText
    : String(value);

  const finalizeInputValue = (inputText: string) => {
    const parsedNumber = inputText === '' ? 0 : Number(inputText);
    const isOutsideMinMax =
      (min !== undefined && parsedNumber < min) ||
      (max !== undefined && parsedNumber > max);
    const valueToApply = isOutsideMinMax
      ? valueWhenEditStartedRef.current
      : parsedNumber;
    onChange(valueToApply);
    setTemporaryInputText(null);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    valueWhenEditStartedRef.current = value;
    setTemporaryInputText(String(value));
    e.target.select();
  };

  const handleInputBlur = () => {
    const currentInputText = temporaryInputText ?? String(value);
    finalizeInputValue(currentInputText);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
    const sanitizedText =
      digitsOnly === '' ? '' : digitsOnly.replace(/^0+/, '') || '0';
    setTemporaryInputText(sanitizedText);
  };

  const handleDecreaseButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const newValue = value - 1;
    if (min !== undefined && newValue < min) {
      onChange(min);
      return;
    }
    onChange(newValue);
  };

  const handleIncreaseButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const newValue = value + 1;
    if (max !== undefined && newValue > max) {
      onChange(max);
      return;
    }
    onChange(newValue);
  };

  const getStepperIconColor = (buttonType: 'decrease' | 'increase') => {
    if (disabled) {
      return theme.mode.grey[400];
    }
    if (variant === 'rounded' && value > 0) {
      return theme.mode.grey[50];
    }

    const isDecreaseDisabled = disabled || (min !== undefined && value <= min);
    const isIncreaseDisabled = disabled || (max !== undefined && value >= max);

    if (buttonType === 'decrease' && isDecreaseDisabled) {
      return theme.mode.grey[400];
    }
    if (buttonType === 'increase' && isIncreaseDisabled) {
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
        onClick={handleDecreaseButtonClick}
        disabled={disabled || (min !== undefined && value <= min)}
      >
        <RemoveIcon color={getStepperIconColor('decrease')} />
      </button>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        id={id}
        value={inputDisplayText}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={handleIncreaseButtonClick}
        disabled={disabled || (max !== undefined && value >= max)}
      >
        <AddIcon color={getStepperIconColor('increase')} />
      </button>
    </S.Container>
  );
};

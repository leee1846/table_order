'use client';

import { useCallback, useMemo, memo } from 'react';
import * as S from './input.styles';
import type { SerializedStyles } from '@emotion/react';

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  customStyle?: SerializedStyles;
  disabled?: boolean;
  name?: string;
  type?: string;
  rightComponent?: React.ReactNode;
  errorMessage?: string;
  inputMode?: 'text' | 'numeric';
  maxLength?: number;
}

const InputComponent = ({
  value = '',
  onChange,
  placeholder = '',
  customStyle,
  disabled = false,
  name,
  type = 'text',
  rightComponent,
  errorMessage,
  inputMode = 'text',
  maxLength,
}: InputProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange?.('');
  }, [onChange]);

  const isPassword = useMemo(() => type === 'password', [type]);
  const passwordLength = useMemo(
    () => (isPassword ? value.length : 0),
    [isPassword, value.length]
  );

  const hasRightSpace = useMemo(
    () => Boolean(rightComponent) || (!disabled && type === 'text' && !!value),
    [rightComponent, disabled, type, value]
  );

  const showClearButton = useMemo(
    () => !disabled && type === 'text' && !!value && !rightComponent,
    [disabled, type, value, rightComponent]
  );

  const passwordDots = useMemo(
    () =>
      Array.from({ length: passwordLength }, (_, index) => (
        <S.PasswordDot key={`password-dot-${index}`}>●</S.PasswordDot>
      )),
    [passwordLength]
  );

  return (
    <>
      <S.InputContainer disabled={disabled} css={customStyle}>
        <S.InputWrapper>
          <S.StyledInput
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            inputMode={inputMode}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            $isPassword={isPassword}
            $hasRightSpace={hasRightSpace}
          />
          {isPassword && (
            <S.PasswordOverlay $hasRightSpace={!!rightComponent}>
              {passwordDots}
            </S.PasswordOverlay>
          )}
        </S.InputWrapper>
        {showClearButton && (
          <S.ClearButton onClick={handleClear} aria-label="입력 지우기">
            ×
          </S.ClearButton>
        )}
        {rightComponent && <S.RightArea>{rightComponent}</S.RightArea>}
      </S.InputContainer>
      {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
    </>
  );
};

InputComponent.displayName = 'Input';

export const Input = memo(InputComponent);

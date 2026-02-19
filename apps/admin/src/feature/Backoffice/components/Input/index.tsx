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
  const handleCompositionStart = useCallback(
    (e: React.CompositionEvent<HTMLInputElement>) => {
      // numeric 모드일 때만 IME 차단
      if (inputMode === 'numeric') {
        const target = e.currentTarget;
        target.blur();

        // 즉시 다시 포커스 (IME는 취소되지만 입력 필드는 활성 상태 유지)
        setTimeout(() => {
          target.focus();
        }, 0);
      }
    },
    [inputMode]
  );

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
            onCompositionStart={handleCompositionStart}
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

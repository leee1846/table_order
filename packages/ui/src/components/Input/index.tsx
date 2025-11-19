'use client';

import * as S from './input.styles';
import { SerializedStyles } from '@emotion/react';

interface InputProps {
  value?: string; // 인풋 입력 값
  onChange?: (value: string) => void;
  placeholder?: string;
  customStyle?: SerializedStyles;
  disabled?: boolean; // 인풋 비활성화 여부
  name?: string; // <input name="email" />
  type?: string; // input type('text', 'password', etc), 부모가 제어
  rightComponent?: React.ReactNode; // 오른쪽 영역 자유롭게
  errorMessage?: string;
}

export const Input = ({
  value = '',
  onChange,
  placeholder = '',
  customStyle,
  disabled = false,
  name,
  type = 'text',
  rightComponent,
  errorMessage,
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };
  const handleClear = () => {
    onChange?.('');
  };
  return (
    <>
      <S.Label disabled={disabled} css={customStyle}>
        <S.StyledInput
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        {!disabled && type === 'text' && !!value && !rightComponent && (
          <S.ClearButton onClick={handleClear} aria-label="입력 지우기">
            ×
          </S.ClearButton>
        )}
        {/* 오른쪽 커스텀 영역 */}
        {rightComponent && <S.RightArea>{rightComponent}</S.RightArea>}
      </S.Label>
      {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
    </>
  );
};

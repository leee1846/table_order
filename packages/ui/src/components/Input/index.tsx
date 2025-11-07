'use client';

import { useState } from 'react';
import * as S from './input.styles';
import { SerializedStyles } from '@emotion/react';

interface InputProps {
  value?: string; // 인풋 입력 값
  onChange?: (value: string) => void;
  placeholder?: string;
  width?: string;
  customStyle?: SerializedStyles;
  disabled?: boolean; // 인풋 비활성화 여부
  name?: string; // <input name="email" />
  type?: string; // input type('text', 'password', etc), 부모가 제어
  iconComponent?: React.ReactNode; // 커스텀 아이콘 (type이 text가 아닐 때)
  onIconClick?: () => void; // 커스텀 아이콘 클릭 핸들러
}

export const Input = ({
  value = '',
  onChange,
  placeholder = '',
  width = '100%',
  customStyle,
  disabled = false,
  name,
  type = 'text',
  iconComponent,
  onIconClick,
}: InputProps) => {
  const [innerValue, setInnerValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInnerValue(val);
    onChange?.(val);
  };

  const handleClear = () => {
    setInnerValue('');
    onChange?.('');
  };

  return (
    <S.Label disabled={disabled} style={{ width }}>
      <S.StyledInput
        name={name}
        type={type}
        value={innerValue}
        onChange={handleChange}
        placeholder={placeholder}
        css={customStyle}
        disabled={disabled}
      />

      {/* 1. text & 값 있으면 clear(x) */}
      {!disabled && type === 'text' && !!innerValue && (
        <S.ClearButton onClick={handleClear} aria-label="입력 지우기">
          ×
        </S.ClearButton>
      )}

      {/* 2. 그 외 type이면 외부 커스텀 아이콘 & 핸들러*/}
      {!disabled && type !== 'text' && iconComponent && (
        <S.ClearButton onClick={onIconClick} aria-label="아이콘">
          {iconComponent}
        </S.ClearButton>
      )}
    </S.Label>
  );
};

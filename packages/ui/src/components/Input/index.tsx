'use client';

import { useState, useId } from 'react';
import * as S from './input.styles';
import { SerializedStyles } from '@emotion/react';
import { VisibilityIcon, VisibilityOffIcon } from '../../icons';
import { colors } from '../../theme/colors';

interface InputProps {
  label: string;
  description?: string;
  value?: string; //인풋 입력 값
  onChange?: (value: string) => void;
  placeholder?: string;
  clearable?: boolean; // 인풋 우측에 작은 x 버튼, 입력 내용 지우기
  width?: string | number;
  required?: boolean; // 필수값 여부, * 표시됨
  invalid?: boolean; // 밸리데이션 실패 여부
  validationMessage?: string; // 에러 메시지
  customStyle?: SerializedStyles;
  password?: boolean; // 비밀번호 입력 모드 여부
  disabled?: boolean; // 인풋 비활성화 여부
  id?: string; // input 태그의 id 속성 값으로 사용 됨, 넣지 않으면 내부에서 생성함
  name?: string; // input 태그의 name 속성 값으로 사용 됨, 넣지 않으면 내부에서 생성함
  price?: boolean; // 가격 입력 모드 여부
}

export const Input = ({
  label,
  description,
  value = '',
  onChange,
  placeholder = '',
  clearable = true,
  width = '100%',
  required = false,
  invalid = false,
  validationMessage,
  customStyle,
  password = false,
  disabled = false,
  id,
  name,
  price = false,
}: InputProps) => {
  const [innerValue, setInnerValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const showClear = clearable && innerValue.length > 0;
  const isPasswordInput = password;
  const inputType = isPasswordInput
    ? showPassword
      ? 'text'
      : 'password'
    : 'text';

  const generatedId = useId();
  const inputId = id || generatedId;

  // 숫자 3자리 콤마 포맷 함수
  const addComma = (num: string) => {
    if (num === '') {
      return '';
    }
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  // 숫자 이외 입력 제거 함수
  const toNumberString = (value: string) => value.replace(/[^\d]/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (price) {
      const onlyNum = toNumberString(val);
      setInnerValue(addComma(onlyNum));
      onChange?.(onlyNum);
    } else {
      setInnerValue(val);
      onChange?.(val);
    }
  };
  const handleClear = () => {
    setInnerValue('');
    onChange?.('');
  };
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <S.Wrapper style={{ width }}>
      <S.Label htmlFor={inputId}>
        {label}
        {required && <S.RequiredMark>*</S.RequiredMark>}
      </S.Label>
      {description && <S.Description>{description}</S.Description>}
      <S.InputBox invalid={invalid} disabled={disabled}>
        <S.StyledInput
          id={inputId}
          name={name}
          type={price ? 'text' : inputType}
          value={innerValue}
          onChange={handleChange}
          placeholder={placeholder}
          css={customStyle}
          disabled={disabled}
        />
        {/* Password toggle - 오른쪽 아이콘 */}
        {isPasswordInput && (
          <S.ClearButton
            type="button"
            tabIndex={-1}
            onClick={handleTogglePassword}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <VisibilityOffIcon
                width={20}
                height={20}
                color={colors.grey[500]}
              />
            ) : (
              <VisibilityIcon width={20} height={20} color={colors.grey[500]} />
            )}
          </S.ClearButton>
        )}
        {/* Clear 버튼 */}
        {showClear && !isPasswordInput && !price && (
          <S.ClearButton onClick={handleClear}>×</S.ClearButton>
        )}
        {price && <S.PriceIcon>원</S.PriceIcon>}
      </S.InputBox>
      {invalid && validationMessage && (
        <S.ValidationMessage>{validationMessage}</S.ValidationMessage>
      )}
    </S.Wrapper>
  );
};

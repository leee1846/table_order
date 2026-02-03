import { SerializedStyles } from '@emotion/react';
import * as S from './RadioButton.style';
import { useId } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  checked: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  customStyle?: SerializedStyles;
}

export const RadioButton = ({
  value,
  onChange,
  checked,
  children,
  disabled = false,
  customStyle,
}: Props) => {
  const uniqueId = useId();

  return (
    <S.Label
      htmlFor={uniqueId}
      checked={checked}
      disabled={disabled}
      css={customStyle}
    >
      <div />
      <input
        type="radio"
        id={uniqueId}
        value={value}
        onChange={() => onChange(value)}
        checked={checked}
        disabled={disabled}
      />
      {children}
    </S.Label>
  );
};

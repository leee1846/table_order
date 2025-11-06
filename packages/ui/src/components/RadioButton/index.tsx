import * as S from './RadioButton.style';

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  checked: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const RadioButton = ({
  id,
  value,
  onChange,
  checked,
  children,
  disabled = false,
}: Props) => {
  return (
    <S.Label htmlFor={id} checked={checked} disabled={disabled}>
      <div />
      <input
        type="radio"
        id={id}
        value={value}
        onChange={() => onChange(value)}
        checked={checked}
        disabled={disabled}
      />
      {children}
    </S.Label>
  );
};

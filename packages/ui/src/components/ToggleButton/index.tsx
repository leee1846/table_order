import * as S from './toggleButton.style';

export type TSize = 'S' | 'M';

interface Props {
  size: TSize;
  isOn: boolean;
  onChange: (isOn: boolean) => void;
  disabled?: boolean;
}

export const ToggleButton = ({
  size = 'S',
  isOn,
  onChange,
  disabled = false,
}: Props) => {
  return (
    <S.Button
      type="button"
      size={size}
      isOn={isOn}
      onClick={() => onChange(!isOn)}
      disabled={disabled}
    >
      <div />
    </S.Button>
  );
};

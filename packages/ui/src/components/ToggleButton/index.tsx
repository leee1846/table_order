import { SerializedStyles } from '@emotion/react';
import * as S from './toggleButton.style';

export type TSize = 'S' | 'M';

interface Props {
  size: TSize;
  isOn: boolean;
  onChange: (isOn: boolean) => void;
  disabled?: boolean;
  customStyle?: SerializedStyles;
}

export const ToggleButton = ({
  size = 'S',
  isOn,
  onChange,
  disabled = false,
  customStyle,
}: Props) => {
  return (
    <S.Button
      type="button"
      size={size}
      isOn={isOn}
      onClick={() => onChange(!isOn)}
      disabled={disabled}
      css={customStyle}
    >
      <div />
    </S.Button>
  );
};

import { SerializedStyles, useTheme } from '@emotion/react';
import * as S from './checkButton.style';
import CheckIcon from '../../icons/CheckIcon';
import { colors } from '../../theme/colors';

export type TVariant = 'square' | 'round';

interface Props {
  id: string;
  variant?: TVariant;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
  customStyle?: SerializedStyles;
}

export const CheckButton = ({
  id,
  variant = 'square',
  checked,
  onChange,
  disabled = false,
  children,
  customStyle,
}: Props) => {
  const { themeMode } = useTheme();

  return (
    <S.Label
      htmlFor={id}
      checked={checked}
      disabled={disabled}
      variant={variant}
      css={customStyle}
    >
      <div>
        {checked && (
          <CheckIcon
            color={themeMode === 'dark' ? colors.black : colors.white}
            width={18}
            height={18}
          />
        )}
      </div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={disabled}
      />
      {children}
    </S.Label>
  );
};

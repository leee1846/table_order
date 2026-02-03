import { useId } from 'react';
import { SerializedStyles } from '@emotion/react';
import * as S from './checkButton.style';
import CheckIcon from '../../icons/CheckIcon';
import { useThemeMode } from '../../hooks/useThemeMode';

export type TVariant = 'square' | 'round';

interface Props {
  variant?: TVariant;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
  customStyle?: SerializedStyles;
}

export const CheckButton = ({
  variant = 'square',
  checked,
  onChange = () => {
    /**noop*/
  },
  disabled = false,
  children,
  customStyle,
}: Props) => {
  const { theme } = useThemeMode();
  const uniqueId = useId();

  return (
    <S.Label
      htmlFor={uniqueId}
      checked={checked}
      disabled={disabled}
      variant={variant}
      css={customStyle}
    >
      <div>
        {checked && (
          <CheckIcon
            width={18}
            height={18}
            color={theme.mode.undefined_palette[700]}
          />
        )}
      </div>
      <input
        type="checkbox"
        id={uniqueId}
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={disabled}
      />
      {children}
      {/* <S.LabelText>{children}</S.LabelText> */}
    </S.Label>
  );
};

import * as S from './keypad.styles';

export type KeypadProps = {
  onNumberPress: (number: number) => void;
  bottomLeftLabel?: string;
  bottomLeftIcon?: React.ReactNode;
  bottomLeftAction: () => void;
  bottomRightLabel?: string;
  bottomRightAction?: () => void;
  bottomRightIcon?: React.ReactNode;
};

export const Keypad = ({
  onNumberPress,
  bottomLeftLabel,
  bottomLeftAction,
  bottomRightLabel,
  bottomRightAction,
  bottomRightIcon,
}: KeypadProps) => {
  const handleNumberClick = (number: number) => {
    onNumberPress(number);
  };

  return (
    <S.KeypadContainer>
      <S.KeypadRow>
        <S.KeypadButton onClick={() => handleNumberClick(1)}>1</S.KeypadButton>
        <S.KeypadButton onClick={() => handleNumberClick(2)}>2</S.KeypadButton>
        <S.KeypadButton onClick={() => handleNumberClick(3)}>3</S.KeypadButton>
      </S.KeypadRow>
      <S.KeypadRow>
        <S.KeypadButton onClick={() => handleNumberClick(4)}>4</S.KeypadButton>
        <S.KeypadButton onClick={() => handleNumberClick(5)}>5</S.KeypadButton>
        <S.KeypadButton onClick={() => handleNumberClick(6)}>6</S.KeypadButton>
      </S.KeypadRow>
      <S.KeypadRow>
        <S.KeypadButton onClick={() => handleNumberClick(7)}>7</S.KeypadButton>
        <S.KeypadButton onClick={() => handleNumberClick(8)}>8</S.KeypadButton>
        <S.KeypadButton onClick={() => handleNumberClick(9)}>9</S.KeypadButton>
      </S.KeypadRow>
      <S.KeypadRow>
        <S.KeypadButton onClick={bottomLeftAction}>
          {bottomLeftLabel || bottomLeftLabel}
        </S.KeypadButton>
        <S.KeypadButton onClick={() => handleNumberClick(0)}>0</S.KeypadButton>
        <S.KeypadButton onClick={bottomRightAction}>
          {bottomRightIcon || bottomRightLabel}
        </S.KeypadButton>
      </S.KeypadRow>
    </S.KeypadContainer>
  );
};

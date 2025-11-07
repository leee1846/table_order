import * as S from './modalBackground.style';

export type TPosition = 'center' | 'top';

interface Props {
  position?: TPosition;
  onClick?: () => void;
  children: React.ReactNode;
}

export const ModalBackground = ({
  position = 'center',
  onClick,
  children,
}: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <S.Container position={position} onClick={handleClick}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </S.Container>
  );
};

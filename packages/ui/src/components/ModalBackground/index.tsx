import * as S from './modalBackground.style';

export type TPosition = 'center' | 'top';

interface Props {
  position?: TPosition;
  onClick?: () => void;
  children: React.ReactNode;
}

export const ModalBackground = ({ position = 'center', children }: Props) => {
  return (
    <S.Container position={position}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </S.Container>
  );
};

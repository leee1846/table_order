import * as S from './modalBackground.style';

export type TPosition = 'center' | 'top';

interface Props {
  position?: TPosition;
  onClick?: () => void;
  children: React.ReactNode;
  /**
   * true(기본): 모달이 길 때 배경 레이어에서 세로 스크롤.
   * false: 배경은 스크롤하지 않음 — 내부에 스크롤이 있을 때 사용.
   */
  scrollableBackdrop?: boolean;
}

export const ModalBackground = ({
  position = 'center',
  children,
  onClick,
  scrollableBackdrop = true,
}: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };


  return (
    <S.Container
      position={position}
      $scrollableBackdrop={scrollableBackdrop}
      onClick={handleClick}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </S.Container>
  );
};

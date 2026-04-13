import * as S from '@/feature/NoContent/noContent.style';

interface Props {
  children: React.ReactNode;
  paddingTop?: string;
  /** 미지정 시 기본 회색(밝은 배경용). 어두운 배경 위에서는 밝은 색을 넘기세요. */
  color?: string;
}

/**
 * 컨텐츠가 없을 때 표시하는 텍스트 UI
 */
export const NoContent = ({ children, paddingTop, color }: Props) => {
  return (
    <S.NoContent style={{ paddingTop, ...(color ? { color } : {}) }}>
      {children}
    </S.NoContent>
  );
};

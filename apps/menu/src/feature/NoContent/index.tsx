import * as S from '@/feature/NoContent/noContent.style';

interface Props {
  children: React.ReactNode;
  paddingTop?: string;
}

/**
 * 컨텐츠가 없을 때 표시하는 텍스트 UI
 */
export const NoContent = ({ children, paddingTop }: Props) => {
  return <S.NoContent style={{ paddingTop }}>{children}</S.NoContent>;
};

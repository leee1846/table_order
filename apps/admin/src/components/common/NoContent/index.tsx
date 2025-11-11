import * as S from '@/components/common/NoContent/noContent.style';

interface Props {
  children: React.ReactNode;
  paddingTop?: string;
}

export const NoContent = ({ children, paddingTop }: Props) => {
  return <S.NoContent style={{ paddingTop }}>{children}</S.NoContent>;
};

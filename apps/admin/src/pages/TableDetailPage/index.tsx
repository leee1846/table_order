import { useParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import * as S from './tableDetailPage.style';
import { useAuth } from '@/hooks/useAuth';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { shopCode } = useAuth();

  if (!shopCode || !tableNum) {
    return null;
  }

  return (
    <S.Container>
      <TableDetailContainer shopCode={shopCode} tableNumber={tableNum} />
    </S.Container>
  );
};

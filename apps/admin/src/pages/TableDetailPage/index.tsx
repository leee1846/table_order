import { useParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import * as S from './tableDetailPage.style';
import { useAuth } from '@/hooks/useAuth';
import type { TOrderType } from '@repo/api/types';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { shopCode } = useAuth();

  const orderType: TOrderType = 'ORDER_POS';

  if (!shopCode || !tableNum) {
    return null;
  }

  return (
    <S.Container>
      <TableDetailContainer
        shopCode={shopCode}
        tableNumber={tableNum}
        orderType={orderType}
      />
    </S.Container>
  );
};

import { useParams, useSearchParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import type { TOrderType } from '@repo/api/types';
import { useShopData } from '@/hooks/useShopData';
import * as S from '@/pages/TableDetailPage/tableDetailPage.style';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const [searchParams] = useSearchParams();
  const { shopData } = useShopData();
  const shopCode = shopData?.shopCode ?? 0;

  const orderType: TOrderType =
    (searchParams.get('orderType') as TOrderType) || 'MENU';

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

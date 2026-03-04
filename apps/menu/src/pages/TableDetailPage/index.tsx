import { useParams, useSearchParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import type { TOrderType } from '@repo/api/types';
import { useShopData } from '@/hooks/useShopData';
import * as S from '@/pages/TableDetailPage/tableDetailPage.style';
import adminI18n from '@/config/i18n/admin.i18n';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const [searchParams] = useSearchParams();
  const { shopData } = useShopData({ skipInitialRequest: true });
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
        i18nInstance={adminI18n}
      />
    </S.Container>
  );
};

import { useParams, useSearchParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import type { TOrderType } from '@repo/api/types';
import * as S from '@/pages/TableDetailPage/tableDetailPage.style';
import adminI18n from '@/config/i18n/admin.i18n';
import { useShopStore } from '@/stores/useShopStore';
import { setPendingOrder } from '@/hooks/useSSEHandler';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const [searchParams] = useSearchParams();
  const { data: shopData } = useShopStore();
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
        onOrderCreated={(orderGroupUuid) => {
          setPendingOrder(orderGroupUuid);
        }}
      />
    </S.Container>
  );
};

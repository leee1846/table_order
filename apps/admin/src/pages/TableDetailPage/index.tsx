import { useParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import * as S from './tableDetailPage.style';
import { useAuth } from '@/hooks/useAuth';
import type { TOrderType } from '@repo/api/types';
import adminI18n from '@/config/i18n';
import { setPendingOrder } from '@/hooks/useSSEHandler';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { shopCode } = useAuth();

  const orderType: TOrderType = 'POS_APP';

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
        onOrderCreated={(orderGroupUuid) => setPendingOrder(orderGroupUuid)}
      />
    </S.Container>
  );
};

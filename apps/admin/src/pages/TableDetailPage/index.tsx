import { useParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import * as S from './tableDetailPage.style';
import { useAuth } from '@/hooks/useAuth';
import type { TOrderType } from '@repo/api/types';
import adminI18n from '@/config/i18n';
import { openConfirmDialog, toast } from '@repo/feature/utils';
import { usePosOrderStore } from '@repo/feature/stores';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { shopCode } = useAuth();

  const orderType: TOrderType = 'POS_APP';

  if (!shopCode || !tableNum) {
    return null;
  }

  const handleOrderCreated = (orderUuid: string) => {
    const onSuccess = () => {
      toast(adminI18n.t('메뉴를 추가했어요.'));
    };
    const onFailure = () => {
      openConfirmDialog({
        title: adminI18n.t('POS 오류'),
        content: adminI18n.t('주문 접수에 실패했습니다. 포스를 확인해주세요.'),
        confirmText: adminI18n.t('확인'),
        size: 'xsmall',
      });
    };
    usePosOrderStore
      .getState()
      .register(orderUuid, String(shopCode), onSuccess, onFailure);
  };

  return (
    <S.Container>
      <TableDetailContainer
        shopCode={shopCode}
        tableNumber={tableNum}
        orderType={orderType}
        i18nInstance={adminI18n}
        onOrderCreated={handleOrderCreated}
      />
    </S.Container>
  );
};

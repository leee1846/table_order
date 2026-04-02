import { useParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import * as S from './tableDetailPage.style';
import { useAuth } from '@/hooks/useAuth';
import type { ICancelOrderMenuRequest, TOrderType } from '@repo/api/types';
import adminI18n from '@/config/i18n';
import { openConfirmDialog, toast } from '@repo/feature/utils';
import { usePosOrderStore } from '@repo/feature/stores';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, usePutCancelOrderMenu } from '@repo/api/queries';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { shopCode } = useAuth();
  const queryClient = useQueryClient();
  const { mutateAsync: cancelOrderMenu } = usePutCancelOrderMenu();
  const orderType: TOrderType = 'POS_APP';

  if (!shopCode || !tableNum) {
    return null;
  }

  const handleOrderCreated = (
    orderUuid: string,
    cancelOrderMenuRequest?: ICancelOrderMenuRequest
  ) => {
    const onSuccess = () => {
      toast(adminI18n.t('메뉴를 추가했어요.'));
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.tableOrderHistories(shopCode, tableNum),
      });
    };
    const onFailure = async () => {
      // TODO: 주문 취소 로직 주석처리
      // 일시적 테스트용
      // try {
      //   if (cancelOrderMenuRequest && cancelOrderMenuRequest.length > 0) {
      //     await cancelOrderMenu(cancelOrderMenuRequest);
      //   }
      // } catch {
      //   // 주문 취소 실패 시 무시
      // }
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

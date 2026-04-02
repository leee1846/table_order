import { useParams, useSearchParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import type { ICancelOrderMenuRequest, TOrderType } from '@repo/api/types';
import * as S from '@/pages/TableDetailPage/tableDetailPage.style';
import adminI18n, { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useShopStore } from '@/stores/useShopStore';
import { usePosOrderStore } from '@repo/feature/stores';
import { openConfirmDialog, toast } from '@repo/feature/utils';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const [searchParams] = useSearchParams();
  const { data: shopData } = useShopStore();
  const shopCode = shopData?.shopCode ?? 0;
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();
  // const { mutateAsync: cancelOrderMenu } = usePutCancelOrderMenu();

  const orderType: TOrderType =
    (searchParams.get('orderType') as TOrderType) || 'MENU';

  if (!shopCode || !tableNum) {
    return null;
  }

  const PosLinkedOrderHandler = (
    orderUuid: string,
    _cancelOrderMenuRequest?: ICancelOrderMenuRequest
  ) => {
    const orderSuccessCallback = () => {
      toast(t('메뉴를 추가했어요.'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.tableOrderHistories(shopCode, tableNum),
      });
    };

    const orderFailCallback = async () => {
      // try {
      //   if (cancelOrderMenuRequest && cancelOrderMenuRequest.length > 0) {
      //     await cancelOrderMenu(cancelOrderMenuRequest);
      //   }
      // } catch {
      //   // 주문 취소 실패 시 무시
      // }
      openConfirmDialog({
        title: t('POS 오류'),
        content: t('주문 접수에 실패했습니다. 포스를 확인해주세요.'),
        confirmText: t('확인'),
        size: 'xsmall',
      });
    };

    const shopCode = String(shopData?.shopCode ?? '');
    usePosOrderStore
      .getState()
      .register(orderUuid, shopCode, orderSuccessCallback, orderFailCallback);
  };

  return (
    <S.Container>
      <TableDetailContainer
        shopCode={shopCode}
        tableNumber={tableNum}
        orderType={orderType}
        i18nInstance={adminI18n}
        onOrderCreated={PosLinkedOrderHandler}
      />
    </S.Container>
  );
};

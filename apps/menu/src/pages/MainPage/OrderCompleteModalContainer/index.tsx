import { useModalStore } from '@/stores/useModalStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { OrderCompleteModal } from '@/pages/MainPage/OrderCompleteModal';
import {
  applyMenuboardStateAfterTableOrderHistoriesCleared,
  isRefetchedTableOrderHistoriesEmpty,
} from '@/utils/applyMenuboardStateAfterTableOrderHistoriesCleared';

export const OrderCompleteModalContainer = () => {
  const { data: modalData, setModalData } = useModalStore();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({ skipInitialRequest: true });

  if (!modalData.isOrderCompleteModalOpened) {
    return null;
  }

  const handleClose = (): void => {
    const { data: modalState } = useModalStore.getState();
    const wasPrepaidCardOrFinalSplit =
      modalState.isOrderCompleteFromPrepaidCardOrFinalSplit;

    setModalData('isOrderCompleteModalOpened', false);
    setModalData('orderCompleteData', null);
    setModalData('orderCompleteTotalPrice', 0);
    setModalData('isOrderCompleteFromPrepaidCardOrFinalSplit', false);
    setModalData('orderCompleteLanguage', 'KO');

    if (!wasPrepaidCardOrFinalSplit) {
      return;
    }

    void (async () => {
      try {
        const shopDetail = useShopDetailStore.getState().data;
        if (!shopDetail?.shopSetting?.usePrepaymentAutoReset) {
          return;
        }

        const tableData = await refreshTableOrderHistoriesData();
        if (!isRefetchedTableOrderHistoriesEmpty(tableData)) {
          return;
        }

        applyMenuboardStateAfterTableOrderHistoriesCleared(shopDetail);
      } catch {
        // refetch 실패 시 기존 화면 유지
      }
    })();
  };

  return (
    <OrderCompleteModal
      onClose={handleClose}
      orderData={modalData.orderCompleteData ?? []}
      totalPrice={modalData.orderCompleteTotalPrice}
    />
  );
};

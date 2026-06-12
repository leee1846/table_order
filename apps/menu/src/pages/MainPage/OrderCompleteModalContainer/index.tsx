import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModalStore } from '@/stores/useModalStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { OrderCompleteModal } from '@/pages/MainPage/OrderCompleteModal';
import { shouldShowOrderCompleteCountdown } from '@/pages/MainPage/OrderCompleteModal/orderCompleteAdVisibility';
import { useAdStore } from '@/stores/useAdStore';
import {
  applyMenuboardStateAfterTableOrderHistoriesCleared,
  isRefetchedTableOrderHistoriesEmpty,
} from '@/utils/applyMenuboardStateAfterTableOrderHistoriesCleared';

const CLOSE_COUNTDOWN_SECONDS = 20;

export const OrderCompleteModalContainer = () => {
  const { data: modalData, setModalData } = useModalStore();
  const { data: adData } = useAdStore();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({ skipInitialRequest: true });
  const [countdown, setCountdown] = useState(CLOSE_COUNTDOWN_SECONDS);

  const countdownActive = useMemo(
    () =>
      shouldShowOrderCompleteCountdown(
        adData.orderCompleteFullFiles,
        adData.orderCompleteSideFiles
      ),
    [adData.orderCompleteFullFiles, adData.orderCompleteSideFiles]
  );

  const handleClose = useCallback((): void => {
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
  }, [setModalData, refreshTableOrderHistoriesData]);

  // 전면 광고가 아닐 때(반쪽 광고·기본 완료 화면) 20초 카운트다운 후 자동 닫기
  useEffect(() => {
    if (!countdownActive) {
      return;
    }
    if (countdown <= 0) {
      handleClose();
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, handleClose, countdownActive]);

  return (
    <OrderCompleteModal
      onClose={handleClose}
      orderData={modalData.orderCompleteData ?? []}
      totalPrice={modalData.orderCompleteTotalPrice}
      countdown={countdown}
      countdownActive={countdownActive}
    />
  );
};

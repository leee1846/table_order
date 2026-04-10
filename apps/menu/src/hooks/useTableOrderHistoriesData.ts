import { useTableOrderHistoriesStore } from '@/stores/useTableOrderHistoriesStore';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';
import { useGetTableOrderHistories } from '@repo/api/queries';
import { useEffect } from 'react';
import { useDeviceData } from '@/hooks/useDeviceData';
import { toast, openConfirmDialog } from '@repo/feature/utils';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useShopStore } from '@/stores/useShopStore';
import { useModalStore } from '@/stores/useModalStore';
import { useDeviceStore } from '@/stores/useDeviceStore';

interface Props {
  /**
   * 초기 API 요청을 건너뛸지 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}

/**
 * 테이블 주문 내역 데이터를 로드하고 관리하는 커스텀 훅
 *
 * @description
 * - 매장 코드와 테이블 번호를 기반으로 주문 내역을 로드합니다
 * - 테이블이 점유되지 않은 경우 'isEmptyTable' 상태로 저장합니다
 * - SSE 업데이트 시간을 전달하여 변경된 데이터만 조회할 수 있습니다
 *
 * @param options - 옵션 설정
 * @returns 주문 내역 데이터 및 제어 함수
 */
export const useTableOrderHistoriesData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};
  const { t } = useCustomerTranslation();

  const { data: shopData } = useShopStore();
  const { data: deviceData, setDataAsync: setDeviceDataAsync } = useDeviceData({
    skipInitialRequest: true,
  });
  const setShowAdminAccessModal = useRequestAdminAccessModalStore(
    (s) => s.setShow
  );

  const { data: storeData, setDataAsync: setTableOrderHistoriesData } =
    useTableOrderHistoriesStore();

  const enabled =
    !!shopData?.shopCode &&
    !!deviceData?.tableNumber &&
    storeData === null &&
    !skipInitialRequest;
  const {
    data: apiData,
    refetch,
    error,
    isLoading,
  } = useGetTableOrderHistories(
    {
      shopCode: shopData?.shopCode ?? '',
      tableNumber: deviceData?.tableNumber ?? '',
    },
    { enabled, ignoreGlobalErrors: [400] }
  );

  useEffect(() => {
    if (!error) {
      return;
    }

    const statusCode = error.response?.data?.status?.code;

    if (statusCode === -101) {
      toast(t('존재하지 않는 테이블입니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      setDeviceDataAsync({
        ...deviceData,
        tableNumber: null,
      });
      setShowAdminAccessModal(true);
      return;
    }

    if (error.response?.status === 400) {
      openConfirmDialog({
        title: 'Server Error',
        content:
          error.response?.data?.status?.userMessage ??
          t('알 수 없는 오류가 발생했습니다.'),
      });
    }
  }, [error, t, deviceData, setDeviceDataAsync, setShowAdminAccessModal]);

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    // 이미 데이터가 있으면 초기 로드가 완료된 것이므로 실행하지 않음
    // refetch는 refresh 함수에서 직접 처리
    if (storeData) {
      return;
    }

    if (!apiData) {
      return;
    }

    // 테이블을 점유하고 주문은 하지 않았을경우
    if (apiData && apiData.data === null) {
      setTableOrderHistoriesData('isEmptyTable');

      // 주문내역이 하나도 없으면 현금 결제 유도 모달 닫기
      useModalStore.getState().clearCashPaymentInducementModal();
      return;
    }

    const orderDetailMenuList = apiData?.data?.orderDetailMenuList ?? [];
    setTableOrderHistoriesData({
      sseUpdatedAt: null,
      discountRate: apiData?.data?.discountRate ?? 0,
      totalAmount: apiData?.data?.totalAmount ?? 0,
      orderDetailMenuList,
    });

    // 주문내역이 하나도 없으면 현금 결제 유도 모달 닫기
    if (orderDetailMenuList.length < 1) {
      useModalStore.getState().clearCashPaymentInducementModal();
    }
  }, [apiData, setTableOrderHistoriesData, storeData, skipInitialRequest]);

  const refresh = async (sseUpdatedAt?: number) => {
    if (
      !useShopStore.getState().data?.shopCode ||
      !useDeviceStore.getState().data?.tableNumber
    ) {
      return;
    }

    const result = await refetch();

    // 테이블을 점유하지 않은 상태일경우
    if (result.data?.data === null) {
      setTableOrderHistoriesData('isEmptyTable');
    } else {
      // 테이블을 점유하고 주문을 했을경우
      await setTableOrderHistoriesData({
        sseUpdatedAt: sseUpdatedAt ?? null,
        discountRate: result.data?.data?.discountRate ?? 0,
        totalAmount: result.data?.data?.totalAmount ?? 0,
        orderDetailMenuList: result.data?.data?.orderDetailMenuList ?? [],
      });
    }

    return result.data?.data;
  };

  return {
    data: storeData,
    isLoading,
    setData: setTableOrderHistoriesData,
    refresh,
  };
};

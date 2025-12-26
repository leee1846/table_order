import { useTableOrderHistoriesStore } from '@/stores/useTableOrderHistoriesStore';
import { useGetTableOrderHistories } from '@repo/api/queries';
import { useEffect } from 'react';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}
export const useTableOrderHistoriesData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData({ skipInitialRequest: true });
  const { data: deviceData } = useDeviceData({ skipInitialRequest: true });

  const { data: storeData, setDataAsync: setTableOrderHistoriesData } =
    useTableOrderHistoriesStore();

  const enabled =
    !!shopData?.shopCode &&
    !!deviceData?.tableNumber &&
    storeData === null &&
    !skipInitialRequest;
  const { data: apiData, refetch } = useGetTableOrderHistories(
    {
      shopCode: shopData?.shopCode ?? '',
      tableNumber: deviceData?.tableNumber ?? '',
    },
    { enabled }
  );

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
      return;
    }

    setTableOrderHistoriesData({
      sseUpdatedAt: null,
      discountRate: apiData?.data?.discountRate ?? 0,
      totalAmount: apiData?.data?.totalAmount ?? 0,
      orderDetailMenuList: apiData?.data?.orderDetailMenuList ?? [],
    });
  }, [apiData, setTableOrderHistoriesData, storeData, skipInitialRequest]);

  const refresh = async (sseUpdatedAt?: number) => {
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
    setData: setTableOrderHistoriesData,
    refresh,
  };
};

import { useTableOrderHistoriesStore } from '@/stores/useTableOrderHistoriesStore';
import { useGetTableOrderHistories } from '@repo/api/queries';
import { useEffect } from 'react';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';

const initialData = {
  sseUpdatedAt: null,
  discountRate: 0,
  totalAmount: 0,
  orderDetailMenuList: [],
};

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

  const { shopData } = useShopData();
  const { data: deviceData } = useDeviceData();

  const {
    data: tableOrderHistoriesData,
    setDataAsync: setTableOrderHistoriesData,
    clearData: clearTableOrderHistoriesData,
  } = useTableOrderHistoriesStore();

  const enabled =
    !!shopData?.shopCode &&
    !!deviceData?.tableNumber &&
    !tableOrderHistoriesData &&
    !skipInitialRequest;
  const { data: tableOrderHistoriesDataResponse, refetch } =
    useGetTableOrderHistories(
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
    if (tableOrderHistoriesData) {
      return;
    }

    if (!tableOrderHistoriesDataResponse) {
      return;
    }

    if (
      !tableOrderHistoriesDataResponse?.data?.orderDetailMenuList ||
      tableOrderHistoriesDataResponse?.data?.orderDetailMenuList?.length < 1
    ) {
      setTableOrderHistoriesData(initialData);
      return;
    }

    setTableOrderHistoriesData({
      sseUpdatedAt: null,
      discountRate: tableOrderHistoriesDataResponse?.data?.discountRate ?? 0,
      totalAmount: tableOrderHistoriesDataResponse?.data?.totalAmount ?? 0,
      orderDetailMenuList:
        tableOrderHistoriesDataResponse?.data?.orderDetailMenuList ?? [],
    });
  }, [
    tableOrderHistoriesDataResponse,
    setTableOrderHistoriesData,
    tableOrderHistoriesData,
    skipInitialRequest,
  ]);

  const refresh = async (sseUpdatedAt?: number) => {
    const result = await refetch();
    if (
      !result.data?.data?.orderDetailMenuList ||
      result.data.data.orderDetailMenuList.length < 1
    ) {
      await setTableOrderHistoriesData(initialData);
      return initialData;
    }

    await setTableOrderHistoriesData({
      sseUpdatedAt: sseUpdatedAt ?? null,
      discountRate: result.data.data.discountRate ?? 0,
      totalAmount: result.data.data.totalAmount ?? 0,
      orderDetailMenuList: result.data.data.orderDetailMenuList ?? [],
    });

    return result.data.data;
  };

  return {
    data: tableOrderHistoriesData,
    setData: setTableOrderHistoriesData,
    clearData: clearTableOrderHistoriesData,
    refresh,
  };
};

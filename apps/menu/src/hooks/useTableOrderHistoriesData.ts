import { useTableOrderHistoriesStore } from '@/stores/useTableOrderHistoriesStore';
import { useGetTableOrderHistories } from '@repo/api/queries';
import type { IGetShop } from '@repo/api/types';
import { useEffect } from 'react';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
  shopData?: IGetShop | null;
  tableNumber?: number;
}
export const useTableOrderHistoriesData = (options?: Props) => {
  const { skipInitialRequest = false, shopData, tableNumber } = options || {};

  const {
    data: tableOrderHistoriesData,
    setData: setTableOrderHistoriesData,
    clearData: clearTableOrderHistoriesData,
  } = useTableOrderHistoriesStore();

  const enabled =
    !!shopData?.shopCode &&
    !!tableNumber &&
    !tableOrderHistoriesData &&
    !skipInitialRequest;
  const { data: tableOrderHistoriesDataResponse, refetch } =
    useGetTableOrderHistories(
      {
        shopCode: shopData?.shopCode ?? '',
        tableNumber: tableNumber ?? 0,
      },
      { enabled }
    );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!tableOrderHistoriesDataResponse) {
      return;
    }

    if (
      !tableOrderHistoriesDataResponse?.data?.orderDetailMenuList ||
      tableOrderHistoriesDataResponse?.data?.orderDetailMenuList?.length < 1
    ) {
      setTableOrderHistoriesData({
        discountRate: 0,
        orderDetailMenuList: [],
      });
      return;
    }

    setTableOrderHistoriesData({
      discountRate: tableOrderHistoriesDataResponse?.data?.discountRate ?? 0,
      orderDetailMenuList:
        tableOrderHistoriesDataResponse?.data?.orderDetailMenuList ?? [],
    });
  }, [
    tableOrderHistoriesDataResponse,
    setTableOrderHistoriesData,
    skipInitialRequest,
  ]);

  const refresh = async () => {
    const result = await refetch();
    if (
      !result.data?.data?.orderDetailMenuList ||
      result.data.data.orderDetailMenuList.length < 1
    ) {
      setTableOrderHistoriesData({
        discountRate: 0,
        orderDetailMenuList: [],
      });
      return;
    }

    setTableOrderHistoriesData({
      discountRate: result.data.data.discountRate ?? 0,
      orderDetailMenuList: result.data.data.orderDetailMenuList ?? [],
    });
  };

  return {
    data: tableOrderHistoriesData,
    setData: setTableOrderHistoriesData,
    clearData: clearTableOrderHistoriesData,
    refresh,
  };
};

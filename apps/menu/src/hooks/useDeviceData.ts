import { useDeviceStore } from '@/stores/useDeviceStore';
import { useEffect } from 'react';
import { useGetDeviceDetail } from '@repo/api/queries';
import { useShopData } from './useShopData';
import type { TDeviceType } from '@repo/api/types';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}
export const useDeviceData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData({ skipInitialRequest: true });
  const {
    data: storeData,
    isInitialized: isInitializedStoreData,
    setDataAsync,
    setIsInitialized,
    clearData,
  } = useDeviceStore();

  const enabled =
    !!shopData?.shopCode &&
    !!storeData?.androidId &&
    !skipInitialRequest &&
    !isInitializedStoreData;

  const {
    data: apiData,
    refetch,
    error,
  } = useGetDeviceDetail({
    shopCode: shopData?.shopCode ?? '',
    androidId: storeData?.androidId ?? '',
    options: { enabled },
    ignoreGlobalErrors: [404],
  });

  useEffect(() => {
    if (skipInitialRequest || !enabled) {
      return;
    }

    if (!apiData) {
      return;
    }

    const newDeviceData = {
      androidId: storeData?.androidId ?? apiData.data.androidId,
      deviceType: 'MENU' as TDeviceType,
      ipAddress: storeData?.ipAddress ?? '',
      version: storeData?.version ?? '',
      buildNumber: storeData?.buildNumber ?? '',
      battery: storeData?.battery ?? 0,
      wifiSignal: storeData?.wifiSignal ?? '',

      shopCode: shopData?.shopCode ?? '',
      tableNumber: apiData.data.tableNumber,
      orderPosNumber: apiData.data.orderPosNumber,
      deviceSeq: apiData.data.deviceSeq,
      shopSeq: apiData.data.shopSeq,
    };

    setDataAsync(newDeviceData);

    // 처음 한 번 요청 성공 시 isInitialized를 true로 설정
    if (!isInitializedStoreData) {
      setIsInitialized(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    apiData,
    setDataAsync,
    skipInitialRequest,
    enabled,
    setIsInitialized,
    isInitializedStoreData,
  ]);

  const refresh = async () => {
    const result = await refetch();

    if (!isInitializedStoreData) {
      setIsInitialized(true);
    }

    if (result.data) {
      setDataAsync(result.data.data);
    }

    return result.data?.data;
  };

  return {
    data: storeData,
    setDataAsync,
    clearData,
    refresh,
    error,
    refetchDeviceDetail: refetch,
  };
};

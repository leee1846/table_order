import { useDeviceStore } from '@/stores/useDeviceStore';
import { useEffect } from 'react';
import { useGetDeviceDetail } from '@repo/api/queries';
import type { TDeviceType } from '@repo/api/types';
import { getDeviceInfo } from '@/utils/deviceInfo';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useShopStore } from '@/stores/useShopStore';

interface Props {
  /**
   * 초기 API 요청을 건너뛸지 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}

/**
 * 디바이스 정보를 로드하고 관리하는 커스텀 훅
 *
 * @description
 * - 매장 코드와 Android ID를 기반으로 디바이스 상세 정보를 로드합니다
 * - 초기화가 완료되지 않은 경우에만 API 호출을 수행합니다
 * - 서버 응답에 필수 정보가 없으면 로컬 디바이스 정보를 병합합니다
 *
 * @param options - 옵션 설정
 * @returns 디바이스 데이터, 초기화 상태 및 제어 함수
 */
export const useDeviceData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { t } = useAdminTranslation();
  const { data: shopData } = useShopStore();
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
      let mergedData = result.data.data;

      // 🔒 서버 응답에 androidId나 ipAddress가 없으면 새로 가져오기
      if (!result.data.data.androidId || !result.data.data.ipAddress) {
        const freshDeviceInfo = await getDeviceInfo({ t });
        mergedData = {
          ...result.data.data,
          androidId: freshDeviceInfo.androidId,
          ipAddress: freshDeviceInfo.ipAddress,
          version: freshDeviceInfo.appInfo.version,
          buildNumber: freshDeviceInfo.appInfo.build,
        };
      }

      setDataAsync(mergedData);
    }

    return result.data?.data;
  };

  return {
    data: storeData,
    isInitialized: isInitializedStoreData,
    setDataAsync,
    clearData,
    refresh,
    error,
    refetchDeviceDetail: refetch,
  };
};

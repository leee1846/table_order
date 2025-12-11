import { useDeviceStore } from '@/stores/useDeviceStore';
import { useEffect } from 'react';
import { useGetDeviceDetail } from '@repo/api/queries';
import { useShopData } from './useShopData';

/** TODO: 추후 선택한 table get api 적용예정 */
const androidId = 'aa7caf6c0894c26f';

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

  const { shopData } = useShopData();
  const { data: storeData, setDataAsync, clearData } = useDeviceStore();

  const enabled =
    !!shopData?.shopCode && !!androidId && !skipInitialRequest && !storeData;

  const {
    data: deviceData,
    refetch,
    error,
  } = useGetDeviceDetail({
    shopCode: shopData?.shopCode ?? '',
    androidId,
    options: { enabled },
    ignoreGlobalErrors: [404],
  });

  useEffect(() => {
    if (skipInitialRequest || !enabled) {
      return;
    }

    if (!deviceData) {
      return;
    }

    setDataAsync(deviceData.data);
  }, [deviceData, setDataAsync, skipInitialRequest, enabled]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data) {
      setDataAsync(result.data.data);
    }
  };

  return { data: storeData, setDataAsync, clearData, refresh, error };
};

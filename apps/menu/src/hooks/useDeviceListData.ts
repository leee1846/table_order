import { useDeviceListStore } from '@/stores/useDeviceListStore';
import { useGetDeviceList } from '@repo/api/queries';
import { useShopData } from '@/hooks/useShopData';
import { useEffect } from 'react';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}
export const useDeviceListData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { data: deviceListData, setDataAsync } = useDeviceListStore();
  const { shopData } = useShopData({ skipInitialRequest: true });

  const enabled =
    !!shopData?.shopCode && !skipInitialRequest && !deviceListData?.deviceList;

  const { data: deviceListDataResponse, refetch } = useGetDeviceList({
    shopCode: shopData?.shopCode ?? '',
    options: { enabled },
  });

  useEffect(() => {
    if (skipInitialRequest || !deviceListDataResponse) {
      return;
    }

    setDataAsync({ deviceList: deviceListDataResponse.data });
  }, [deviceListDataResponse, setDataAsync, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data) {
      setDataAsync({ deviceList: result.data.data });
    }
  };

  return { data: deviceListData?.deviceList, refresh };
};

import { useShopPageSettingStore } from '@/stores/useShopPageSettingStore';
import { useShopData } from '@/hooks/useShopData';
import { useGetShopPageSetting } from '@repo/api/queries';
import { useEffect } from 'react';
import { mockShopPageSetting } from '@/mocks/mockShopPageSetting';

interface Props {
  skipInitialRequest?: boolean;
}
export const useShopPageSettingData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData();
  const { data: storeData, setPageSettingData: setStoreData } =
    useShopPageSettingStore();

  const enabled =
    !!shopData?.shopCode && !storeData?.pageSettingData && !skipInitialRequest;
  const { data: pageSettingDataResponse, refetch } = useGetShopPageSetting(
    shopData?.shopCode ?? '',
    { enabled }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!pageSettingDataResponse) {
      return;
    }

    // TODO: Mock 데이터 삭제 예정
    // setStoreData(pageSettingDataResponse.data);
    setStoreData(mockShopPageSetting);
  }, [pageSettingDataResponse, setStoreData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      // TODO: Mock 데이터 삭제 예정
      // setStoreData(result.data.data);
      setStoreData(mockShopPageSetting);
    }
  };

  return {
    data: storeData?.pageSettingData,
    refresh,
  };
};

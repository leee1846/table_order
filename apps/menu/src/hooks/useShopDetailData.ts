import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useShopData } from './useShopData';
import { useGetShopDetail } from '@repo/api/queries';
import { useEffect } from 'react';

interface Props {
  skipInitialRequest?: boolean;
}
export const useShopDetailData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData({ skipInitialRequest: true });
  const { data: storeData, setData: setShopDetailData } = useShopDetailStore();

  const enabled = !!shopData?.shopCode && !storeData && !skipInitialRequest;
  const { data: apiData, refetch } = useGetShopDetail(
    shopData?.shopCode ?? '',
    { enabled }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!apiData) {
      return;
    }

    const updateData = async () => {
      await setShopDetailData(apiData.data);
    };

    updateData();
  }, [apiData, setShopDetailData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      await setShopDetailData(result.data.data);
    }
  };

  return {
    data: storeData,
    refresh,
  };
};

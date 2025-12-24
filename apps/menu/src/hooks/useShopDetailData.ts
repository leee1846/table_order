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
  const { data: shopDetailData, setData: setShopDetailData } =
    useShopDetailStore();

  const enabled =
    !!shopData?.shopCode && !shopDetailData && !skipInitialRequest;
  const { data: shopDetailDataResponse, refetch } = useGetShopDetail(
    shopData?.shopCode ?? '',
    { enabled }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!shopDetailDataResponse) {
      return;
    }

    setShopDetailData(shopDetailDataResponse.data);
  }, [shopDetailDataResponse, setShopDetailData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      setShopDetailData(result.data.data);
    }
  };

  return {
    data: shopDetailData,
    refresh,
  };
};

import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useShopData } from './useShopData';
import { useGetShopDetail } from '@repo/api/queries';
import { useEffect } from 'react';
import { mockShopDetail } from '@/mocks/mockShopDetail';

interface Props {
  skipInitialRequest?: boolean;
}
export const useShopDetailData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData();
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

    // TODO: Mock 데이터 삭제 예정
    setShopDetailData(mockShopDetail);
    // setShopDetailData(shopDetailDataResponse.data);
  }, [shopDetailDataResponse, setShopDetailData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      // TODO: Mock 데이터 삭제 예정
      setShopDetailData(mockShopDetail);
      // setShopDetailData(result.data.data);
    }
  };

  return {
    data: shopDetailData,
    refresh,
  };
};

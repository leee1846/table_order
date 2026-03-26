import { useCallback, useEffect } from 'react';
import { useGetShopDetail } from '@repo/api/queries';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useAuth } from '@/hooks/useAuth';

//나중에 UI 분기처리 할 때 shop의 설정 정보가 필요해서 만듦
export const useShopDetailData = () => {
  const { shopCode } = useAuth();

  const { data: shopDetailData, setData: setShopDetailData } =
    useShopDetailStore();

  const enabled = !!shopCode && shopCode.length > 0;

  const {
    data: shopDetailDataResponse,
    refetch,
    isFetching,
  } = useGetShopDetail(shopCode ?? '', {
    enabled,
  });

  useEffect(() => {
    if (!shopDetailDataResponse) {
      return;
    }

    setShopDetailData(shopDetailDataResponse.data);
  }, [shopDetailDataResponse, setShopDetailData]);

  const refresh = useCallback(async () => {
    if (!shopCode) {
      return null;
    }

    const result = await refetch();
    if (result.data?.data) {
      setShopDetailData(result.data.data);
      return result.data.data;
    }
    return null;
  }, [refetch, setShopDetailData, shopCode]);

  return {
    data: shopDetailData,
    refresh,
    isLoading: enabled && isFetching,
  };
};

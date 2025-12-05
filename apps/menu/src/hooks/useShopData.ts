import { useEffect } from 'react';
import { useGetShops } from '@repo/api/queries';
import { useShopStore } from '@/stores/data/useShopStore';

interface Props {
  /**
   * useEffect 실행을 건너뛸지 여부
   * 초기 api요청 건너뛰기 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}

/**
 * Shop 데이터를 로드하는 커스텀 훅
 * - Store에 데이터가 있으면 API 호출하지 않음
 * - API 응답을 받으면 Store에 자동 저장 (Storage에도 저장됨)
 */
export const useShopData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};
  const { data: shopData, setData: setShopData } = useShopStore();
  const { data: shopsData, refetch } = useGetShops({
    enabled: shopData === null && !skipInitialRequest,
  });

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!shopsData?.data || shopsData.data.length === 0) {
      return;
    }

    const firstShop = shopsData.data[0];
    if (firstShop) {
      setShopData(firstShop);
    }
  }, [shopsData, setShopData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data && result.data.data.length > 0) {
      const firstShop = result.data.data[0];
      if (firstShop) {
        setShopData(firstShop);
      }
    }
  };

  return {
    shopData,
    refresh,
  };
};

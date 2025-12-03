import { useEffect } from 'react';
import { useGetShops } from '@repo/api/queries';
import { useShopStore } from '@/stores/useShopStore';

/**
 * Shop 데이터를 로드하는 커스텀 훅
 * - Store에 데이터가 있으면 API 호출하지 않음
 * - API 응답을 받으면 Store에 자동 저장 (Storage에도 저장됨)
 * - Store의 refresh 메서드를 통해 수동 갱신 가능 (SSE용)
 */
export const useShopData = () => {
  const { data: shopData, setData: setShopData } = useShopStore();
  const { data: shopsData, refetch } = useGetShops({
    enabled: shopData === null,
  });

  // API 응답을 받으면 Store에 저장
  useEffect(() => {
    if (!shopsData?.data || shopsData.data.length === 0) {
      return;
    }

    const firstShop = shopsData.data[0];
    if (firstShop) {
      setShopData(firstShop);
    }
  }, [shopsData, setShopData]);

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

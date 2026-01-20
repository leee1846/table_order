import { useEffect } from 'react';
import { useGetShops } from '@repo/api/queries';
import { useShopStore } from '@/stores/useShopStore';
import { getAccessToken } from '@repo/api/auth';

interface Props {
  /**
   * 초기 API 요청을 건너뛸지 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}

/**
 * 매장 데이터를 로드하고 관리하는 커스텀 훅
 *
 * @description
 * - Store에 데이터가 있으면 API 호출을 건너뜁니다
 * - API 응답을 받으면 Store에 자동 저장됩니다 (Storage에도 저장됨)
 * - 첫 번째 매장을 기본값으로 선택합니다
 *
 * @param options - 옵션 설정
 * @returns 매장 데이터 및 새로고침 함수
 */
export const useShopData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};
  const { data: storeData, setData: setShopData } = useShopStore();
  const { data: apiData, refetch } = useGetShops({
    enabled: storeData === null && !skipInitialRequest && !!getAccessToken(),
  });

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!apiData?.data || apiData.data.length === 0) {
      return;
    }

    const firstShop = apiData.data[0];
    if (firstShop) {
      setShopData(firstShop);
    }
  }, [apiData, setShopData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data && result.data.data.length > 0) {
      const firstShop = result.data.data[0];
      if (firstShop) {
        setShopData(firstShop);
      }
    }

    return result.data?.data[0];
  };

  return {
    shopData: storeData,
    refresh,
  };
};

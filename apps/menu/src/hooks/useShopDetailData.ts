import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useGetShopDetail } from '@repo/api/queries';
import { useEffect } from 'react';
import { useShopStore } from '@/stores/useShopStore';

interface Props {
  /**
   * 초기 API 요청을 건너뛸지 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}

/**
 * 매장 상세 정보를 로드하고 관리하는 커스텀 훅
 *
 * @description
 * - useShopData를 통해 매장 코드를 가져옵니다
 * - Store에 데이터가 있으면 API 호출을 건너뜁니다
 * - API 응답을 받으면 Store에 자동 저장됩니다
 *
 * @param options - 옵션 설정
 * @returns 매장 상세 데이터 및 새로고침 함수
 */
export const useShopDetailData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { data: shopData } = useShopStore();
  const { data: storeData, setData: setShopDetailData } = useShopDetailStore();

  const enabled = !!shopData?.shopCode && !storeData && !skipInitialRequest;
  const { data: apiData, refetch, isLoading } = useGetShopDetail(
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
    if (!useShopStore.getState().data?.shopCode) {
      return;
    }

    const result = await refetch();
    if (result.data?.data) {
      await setShopDetailData(result.data.data);
    }
    return result.data?.data;
  };

  return {
    data: storeData,
    isLoading,
    refresh,
  };
};

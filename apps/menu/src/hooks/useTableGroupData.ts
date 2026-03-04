import { useGetTableGroupList } from '@repo/api/queries';
import { useShopData } from '@/hooks/useShopData';
import { useTableGroupStore } from '@/stores/useTableGroupStore';
import { useEffect } from 'react';

interface Props {
  /**
   * 초기 API 요청을 건너뛸지 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}

/**
 * 테이블 그룹 데이터를 로드하고 관리하는 커스텀 훅
 *
 * @description
 * - 매장 코드를 기반으로 테이블 그룹 목록을 로드합니다
 * - Store에 데이터가 있으면 API 호출을 건너뜁니다
 *
 * @param options - 옵션 설정
 * @returns 테이블 그룹 데이터 및 새로고침 함수
 */
export const useTableGroupData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData({ skipInitialRequest: true });
  const { data: storeData, setData: setTableGroupsStoreData } =
    useTableGroupStore();

  const { data: apiData, refetch } = useGetTableGroupList(
    { shopCode: shopData?.shopCode ?? '' },
    {
      enabled: !!shopData?.shopCode && !skipInitialRequest && !storeData,
    }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!apiData) {
      return;
    }

    setTableGroupsStoreData(apiData.data);
  }, [apiData, setTableGroupsStoreData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      setTableGroupsStoreData(result.data.data);
    }
  };

  return { data: storeData, refresh };
};

import { useQueryClient } from '@repo/api/tanstack-query';
import { isNetworkErrorWithGetRequest } from '@repo/api/globalErrorHandler';
import { useShopData } from '@/hooks/useShopData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useShopThemePage } from '@/hooks/useShopThemePage';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { closeNetworkErrorDialogAndClearState } from '@/config/tanstackQuery/QueryProvider';

// 초기 API 호출 없이 refresh 함수만 사용하기 위한 공통 옵션
const SKIP_INITIAL = { skipInitialRequest: true } as const;

/**
 * 네트워크 복구 시 현재 페이지에서 사용 중인 모든 GET API를 재요청하고,
 * 전부 성공하면 네트워크 에러 다이얼로그를 닫는다.
 *
 * - skipInitialRequest: true 로 마운트되므로 초기 API 요청은 발생하지 않음
 * - 성공 여부는 React Query 캐시의 error 상태로 판별
 * - tableNumber 의존 API는 테이블 미선택 시 호출하지 않아 불필요한 에러를 방지
 */
export const useNetworkRecoveryRefresh = () => {
  const queryClient = useQueryClient();
  // tableNumber 의존 refresh 호출 여부 판단용 (TablesPage에서 미선택 시 에러 방지)
  const tableNumber = useDeviceStore((s) => s.data?.tableNumber);

  const { refresh: refreshShopData } = useShopData(SKIP_INITIAL);
  const { refresh: refreshShopDetailData } = useShopDetailData(SKIP_INITIAL);
  const { refresh: refreshCategoriesData } = useCategoriesData(SKIP_INITIAL);
  const { refresh: refreshDeviceData } = useDeviceData(SKIP_INITIAL);
  const { refresh: refreshTableGroupData } = useTableGroupData(SKIP_INITIAL);
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData(SKIP_INITIAL);
  const { refresh: refreshShopThemePage } = useShopThemePage(SKIP_INITIAL);

  const refreshAllAndCloseDialogOnSuccess = async (): Promise<void> => {
    await Promise.allSettled([
      // store 기반 훅: refetch + store 갱신 (enabled:false 이므로 refetchQueries 미포함)
      refreshShopData(),
      refreshShopDetailData(),
      refreshDeviceData(),
      refreshTableGroupData(),
      refreshShopThemePage(),
      // tableNumber 의존 API: 테이블 미선택 상태에서 호출 시 400/-101 에러 사이드이펙트 발생
      ...(tableNumber
        ? [refreshCategoriesData(), refreshTableOrderHistoriesData()]
        : []),
      // 직접 React Query 패턴: 현재 페이지의 활성 쿼리 전체 재요청
      // (TablesPage의 useGetCurrentTableList, useGetDeviceList 등 포함)
      queryClient.refetchQueries({ type: 'active' }),
    ]);

    // 활성 쿼리 중 네트워크 에러(response 없음)가 남아있을 때만 다이얼로그 유지
    const hasActiveNetworkErrors = queryClient
      .getQueryCache()
      .findAll({ type: 'active' })
      .some((query) => isNetworkErrorWithGetRequest(query.state.error));

    if (!hasActiveNetworkErrors) {
      closeNetworkErrorDialogAndClearState();
    }
  };

  return { refreshAllAndCloseDialogOnSuccess };
};

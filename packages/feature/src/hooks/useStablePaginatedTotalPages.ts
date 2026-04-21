import { useMemo } from 'react';

/**
 * `placeholderData: keepPreviousData` 사용 시 페이지 전환에서 totalPages 깜빡임을 막고,
 * 확정 응답에서 목록이 비면 totalPages를 1로 맞춥니다.
 */
export function useStablePaginatedTotalPages(
  isPlaceholderData: boolean,
  apiTotalPages: number | null | undefined,
  itemCount: number
): number {
  return useMemo(() => {
    if (isPlaceholderData) {
      return typeof apiTotalPages === 'number' && apiTotalPages >= 1
        ? apiTotalPages
        : 1;
    }
    if (itemCount === 0) {
      return 1;
    }
    return Math.max(1, apiTotalPages ?? 1);
  }, [isPlaceholderData, apiTotalPages, itemCount]);
}

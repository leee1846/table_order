import { useEffect, useState } from 'react';
import type { UseQueryResult } from '@repo/api/tanstack-query';

interface UsePaginationWithCacheOptions<TData> {
  queryResult: UseQueryResult<TData>; // 쿼리, 요청 성공했는지지
  getTotalPages: (data: TData | undefined) => number | undefined;
  requestedPage: number; // 요청한 페이지(현재 페이지)
  onPageChange: (page: number) => void;
  initialPage?: number; // 초기 페이지
}

interface UsePaginationWithCacheReturn {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  resetPage: () => void;
  isLoading: boolean;
  isFetching: boolean;
}

export function usePaginationWithCache<TData = unknown>({
  queryResult,
  getTotalPages,
  requestedPage,
  onPageChange,
  initialPage = 1,
}: UsePaginationWithCacheOptions<TData>): UsePaginationWithCacheReturn {
  const [cachedTotalPages, setCachedTotalPages] = useState<number>(1);

  const { data, isSuccess, isLoading, isFetching, isError } = queryResult;

  useEffect(() => {
    if (isSuccess && data) {
      const totalPages = getTotalPages(data);

      if (totalPages !== undefined) {
        setCachedTotalPages(totalPages);
      }
    }
  }, [isSuccess, data, getTotalPages]);

  const currentTotalPages = getTotalPages(data);

  const totalPages =
    isLoading || isFetching || isError
      ? cachedTotalPages
      : (currentTotalPages ?? 1);

  const resetPage = () => {
    onPageChange(initialPage);
  };

  return {
    currentPage: requestedPage,
    totalPages,
    handlePageChange: onPageChange,
    resetPage,
    isLoading,
    isFetching,
  };
}

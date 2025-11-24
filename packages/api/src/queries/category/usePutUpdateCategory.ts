import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCategory } from '../../fetchers/category';
import type { ICategory, TUpdateCategoryResponse } from '../../types/category';
import { IApiError } from '../../types/common';

/**
 * 카테고리를 수정합니다.
 */
export const usePutUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<TUpdateCategoryResponse, AxiosError<IApiError>, ICategory>(
    {
      mutationFn: updateCategory,
      onSuccess: () => {
        // 카테고리 리스트 쿼리 무효화하여 최신 데이터로 갱신
        queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
      },
    }
  );
};

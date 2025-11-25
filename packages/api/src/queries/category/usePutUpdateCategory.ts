import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCategory } from '../../fetchers/category';
import { queryKeys } from '../queryKeys';
import type {
  IUpdateCategoryRequest,
  TCategoryMutationResponse,
} from '../../types/category';
import { IApiError } from '../../types/common';

/**
 * 카테고리를 수정합니다.
 */
export const usePutUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TCategoryMutationResponse,
    AxiosError<IApiError>,
    IUpdateCategoryRequest
  >({
    mutationFn: updateCategory,
    onSuccess: () => {
      // 카테고리 리스트 쿼리 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
    },
  });
};

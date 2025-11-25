import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteCategory } from '../../fetchers/category';
import type {
  IDeleteCategoryParams,
  TCategoryMutationResponse,
} from '../../types/category';
import { IApiError } from '../../types/common';

/**
 * 카테고리를 삭제합니다.
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TCategoryMutationResponse,
    AxiosError<IApiError>,
    IDeleteCategoryParams
  >({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // 카테고리 리스트 쿼리 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
    },
  });
};
